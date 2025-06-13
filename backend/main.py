import logging
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pipeline import analyze_audio_and_word, get_word_ipa
from logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(audioFile: UploadFile = File(...), target_word: str = Form(...)):
    logger.info(f"Received /analyze request: audioFile={audioFile.filename}, target_word={target_word}")
    try:
        result = await analyze_audio_and_word(audioFile, target_word)
        logger.info(f"Analysis result: {result}")
        return JSONResponse(content=result)
    except Exception as e:
        logger.exception(f"Error in /analyze: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ipa")
async def ipa(target_word: str = Form(...)):
    logger.info(f"Received /ipa request: target_word={target_word}")
    try:
        result = await get_word_ipa(target_word)
        logger.info(f"IPA result: {result}")
        return JSONResponse(content=result)
    except Exception as e:
        logger.exception(f"Error in /ipa: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 