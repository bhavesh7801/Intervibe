import os
import tempfile
import logging
from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from groq import Groq

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/audio", tags=["audio-transcription"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@router.post("/transcribe")
async def transcribe_audio_file(file: UploadFile = File(...)):
    """Transcribe recorded microphone audio file (WAV/WebM) to text using Groq Whisper-large-v3 AI model.
    Auto-detects language (English, Hindi, Hinglish) and speech inputs.
    """
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GROQ_API_KEY is not configured for Whisper transcription."
        )

    try:
        content = await file.read()
        logger.info(f"Received audio file for transcription: {len(content)} bytes, filename: {file.filename}")
        
        # Security: Size Validation (Max 25 MB)
        if len(content) > 25 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large. Maximum size is 25MB.")
            
        # Security: Content Type Validation
        if file.content_type and not file.content_type.startswith(("audio/", "video/")):
            raise HTTPException(status_code=400, detail="Invalid file type. Must be an audio or video file.")
            
        if len(content) < 100:
            return {"transcript": "", "note": "Audio recording empty or too short."}

        filename = file.filename or "recording.webm"
        ext = Path(filename).suffix or ".webm"
        mime_type = file.content_type or f"audio/{ext.lstrip('.')}"
        
        import io
        audio_stream = io.BytesIO(content)

        client = Groq(api_key=GROQ_API_KEY)
        
        # Omit hardcoded language="en" to enable auto-detection for English/Hindi/Multilingual speech
        # Using zero-disk stream upload directly from memory
        transcription = client.audio.transcriptions.create(
            file=(f"recording{ext}", audio_stream, mime_type),
            model="whisper-large-v3",
            response_format="json",
            temperature=0.0
        )
        
        extracted_text = getattr(transcription, "text", str(transcription))
        if isinstance(transcription, dict):
            extracted_text = transcription.get("text", "")

        cleaned_text = extracted_text.strip()
        logger.info(f"⚡ Groq Whisper audio transcription result ({len(cleaned_text)} chars): '{cleaned_text}'")
        return {"transcript": cleaned_text}

    except Exception as e:
        logger.error(f"Whisper Audio Transcription error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Audio transcription failed due to an internal server error."
        )
