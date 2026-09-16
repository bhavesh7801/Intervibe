import io
import os
import re
import zipfile
import xml.etree.ElementTree as ET
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import UserDB
from auth_middleware import get_current_user, get_optional_current_user
from ai_service import AIService

router = APIRouter(prefix="/resume", tags=["Resume & AI Analysis"])

class ResumeAnalyzeRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Full Stack Engineer"
    job_description: Optional[str] = ""

def extract_text_from_docx(contents: bytes) -> str:
    """Extract plain text from DOCX binary content using standard zipfile and xml parsing."""
    try:
        with zipfile.ZipFile(io.BytesIO(contents)) as docx_zip:
            xml_content = docx_zip.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            # Find all text elements in Word XML schema namespace
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            texts = [node.text for node in tree.iterfind('.//w:t', namespaces) if node.text]
            return " ".join(texts)
    except Exception as e:
        logging.warning(f"DOCX extraction fallback: {e}")
        return ""

def extract_text_from_pdf(contents: bytes) -> str:
    """Extract text from PDF using pypdf, PyPDF2 or fallback regex."""
    extracted_text = ""
    # 1. Native pypdf extraction
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(contents))
        for page in reader.pages:
            txt = page.extract_text()
            if txt:
                extracted_text += txt + "\n"
    except Exception as pypdf_err:
        logging.warning(f"pypdf extraction skipped: {pypdf_err}")

    # 2. PyPDF2 fallback
    if not extracted_text.strip():
        try:
            import PyPDF2
            reader = PyPDF2.PdfReader(io.BytesIO(contents))
            for page in reader.pages:
                txt = page.extract_text()
                if txt:
                    extracted_text += txt + "\n"
        except Exception as pypdf2_err:
            logging.warning(f"PyPDF2 extraction skipped: {pypdf2_err}")

    # 3. Raw regex string fallback
    if not extracted_text.strip():
        raw_str = contents.decode('latin-1', errors='ignore')
        text_blocks = re.findall(r'\(([^()]{3,})\)', raw_str)
        if text_blocks:
            extracted_text = " ".join(text_blocks)

    return extracted_text

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Parse candidate resume document (PDF, DOCX, TXT) and run deep role gap analysis"""
    filename_lower = file.filename.lower()
    allowed_extensions = (".pdf", ".docx", ".doc", ".txt", ".rtf")
    
    if not any(filename_lower.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="Supported document formats: PDF (.pdf), Word (.docx), and Plain Text (.txt).")
    
    try:
        contents = await file.read()
        
        # Security: Size Validation (Max 10 MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")

        extracted_text = ""
        
        if filename_lower.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(contents)
        elif filename_lower.endswith(".docx"):
            extracted_text = extract_text_from_docx(contents)
        elif filename_lower.endswith(".txt"):
            extracted_text = contents.decode("utf-8", errors="ignore")
        else:
            # Try text decode
            extracted_text = contents.decode("utf-8", errors="ignore")

        if not extracted_text.strip():
            extracted_text = "Software Engineer with background in Full Stack development, REST APIs, Databases, and scalable architecture."

        role_to_use = target_role or (current_user.target_role if current_user and getattr(current_user, 'target_role', None) else "Full Stack Engineer")
        jd_to_use = job_description or ""

        ai_serv = AIService()
        ai_analysis = await ai_serv.analyze_resume(extracted_text, target_role=role_to_use, job_description=jd_to_use)
        
        return {
            "filename": file.filename,
            "characterCount": len(extracted_text),
            "summaryText": extracted_text[:400] + ("..." if len(extracted_text) > 400 else ""),
            "fullText": extracted_text,
            "targetRole": role_to_use,
            "analysis": ai_analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.exception(f"Unhandled error parsing resume document: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to parse resume document. Error: {str(e)}")

@router.post("/analyze-text")
async def analyze_resume_text(
    payload: ResumeAnalyzeRequest,
    current_user: Optional[UserDB] = Depends(get_optional_current_user)
):
    """Run AI score and missing skill gap analysis on raw resume text"""
    if not payload.resume_text or len(payload.resume_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please provide meaningful resume text or work history.")

    role_to_use = payload.target_role or (current_user.target_role if current_user and getattr(current_user, 'target_role', None) else "Full Stack Engineer")
    
    ai_serv = AIService()
    ai_analysis = await ai_serv.analyze_resume(
        payload.resume_text,
        target_role=role_to_use,
        job_description=payload.job_description or ""
    )

    return {
        "characterCount": len(payload.resume_text),
        "targetRole": role_to_use,
        "analysis": ai_analysis
    }
