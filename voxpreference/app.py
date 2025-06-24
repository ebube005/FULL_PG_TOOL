from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import librosa
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from text_to_ipa import convert_to_ipa
import torch
import os
import logging
import sys
from typing import List
import numpy as np
import re

os.environ["HF_HOME"] = "/app/hf_home"


# Logging configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger("voxpreference.app")

logger.info("Starting Voxpreference FastAPI app...")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
processor = Wav2Vec2Processor.from_pretrained("thebickersteth/wav2vec2-nigerian-english")
model = Wav2Vec2ForCTC.from_pretrained("thebickersteth/wav2vec2-nigerian-english")
# model.eval()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code} for {request.method} {request.url}")
        return response
    except Exception as exc:
        logger.exception(f"Unhandled exception for {request.method} {request.url}")
        raise

@app.get("/")
def root():
    logger.info("Root endpoint called.")
    return {"message": "Welcome! This API is for transcription. Try /health or /transcribe."}


@app.get("/health")
def health():
    logger.info("Health check endpoint called.")
    return {"status": "ok"} 

@app.post("/")
async def transcribe(audioFile: UploadFile = File(...)):
    logger.info(f"Transcription endpoint called. Filename: {audioFile.filename}")
    try:
        audio_bytes = await audioFile.read()
        logger.debug(f"Read {len(audio_bytes)} bytes from uploaded file.")
        audio_input, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)
        logger.debug("Audio loaded and resampled to 16kHz.")
        duration = len(audio_input) / sr
        inputs = processor(audio_input, sampling_rate=16000, return_tensors="pt")
        logger.debug("Audio processed for model input.")
        with torch.no_grad():
            logits = model(inputs.input_values).logits
            predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.batch_decode(predicted_ids.numpy())[0]
        logger.info(f"Transcription result: {transcription}")
        words = transcription.strip().split()
        n_words = len(words)
        segments = []
        if n_words > 0:
            word_duration = duration / n_words
            for i, word in enumerate(words):
                start = round(i * word_duration, 2)
                end = round((i + 1) * word_duration, 2)
                ipa_result = convert_to_ipa(word)
                ipa = ipa_result["ipa"] if ipa_result["success"] else None
                ipa_error = ipa_result["error"] if not ipa_result["success"] else None
                segments.append({
                    "start": start,
                    "end": end,
                    "text": word,
                    "ipa": ipa,
                    "ipa_error": ipa_error
                })
        logger.info(f"Final result: {segments, transcription, duration}")
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "segments": segments,
                "transcription": transcription,
                "duration": duration
            }
        )
    except Exception as e:
        logger.exception(f"Error during transcription process: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/ipa")
async def word_to_ipa(word: str = Form(...)):
    logger.info(f"IPA endpoint called for word: {word}")
    try:
        ipa_result = convert_to_ipa(word)
        ipa = ipa_result["ipa"] if ipa_result["success"] else None
        ipa_error = ipa_result["error"] if not ipa_result["success"] else None
        return JSONResponse(
            status_code=200,
            content={
                "success": ipa_result["success"],
                "ipa": ipa,
                "ipa_error": ipa_error
            }
        )
    except Exception as e:
        logger.exception(f"Error during IPA conversion: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )
