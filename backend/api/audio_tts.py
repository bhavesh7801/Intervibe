import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from gtts import gTTS

router = APIRouter(prefix="/api/audio", tags=["audio-tts"])

class TTSRequest(BaseModel):
    text: str

@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech using Google TTS and stream the audio back."""
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
        
    try:
        tts = gTTS(text=request.text, lang='en', slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        return StreamingResponse(
            fp, 
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=speech.mp3"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="TTS Generation failed due to an internal server error.")
