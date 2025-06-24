---
title: Voxpreference
emoji: 📈
colorFrom: indigo
colorTo: gray
sdk: docker
pinned: false
short_description: speech recognition using nigerian english

---

# Voxpreference 📈

**Speech Recognition and IPA Transcription for Nigerian English**

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Demo](#demo)
- [Quickstart](#quickstart)
  - [Running Locally (Docker)](#running-locally-docker)
  - [Running on Hugging Face Spaces](#running-on-hugging-face-spaces)
- [API Reference](#api-reference)
  - [Root Endpoint `/`](#root-endpoint-)
  - [Health Endpoint `/health`](#health-endpoint-health)
  - [Transcription Endpoint `/` (POST)](#transcription-endpoint--post)
- [Environment Variables](#environment-variables)
- [Logging](#logging)
- [Cache and Storage Management](#cache-and-storage-management)
- [Development](#development)
- [Finetuning the Model](#finetuning-the-model)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Project Overview

**Voxpreference** is a FastAPI-based web service for automatic speech recognition (ASR) and International Phonetic Alphabet (IPA) transcription, specifically tailored for Nigerian English. It leverages a fine-tuned Wav2Vec2 model and the `phonemizer` library to provide both text and phonetic transcriptions of uploaded audio files.

The project is designed for easy deployment on [Hugging Face Spaces](https://huggingface.co/spaces) and in Dockerized environments.

---

## Features

- **Speech-to-Text**: Transcribes Nigerian English audio to text using a custom Wav2Vec2 model.
- **IPA Transcription**: Converts recognized text to IPA using `phonemizer`.
- **REST API**: Simple endpoints for health check and transcription.
- **Production-Grade Logging**: Extensive logging for debugging and monitoring.
- **Cache Management**: Configurable cache directories for model and Hugging Face data.
- **Docker & Hugging Face Spaces Ready**: Optimized for containerized and cloud deployment.

---

## Architecture

- **FastAPI**: Web framework for serving the API.
- **Wav2Vec2**: Transformer-based ASR model, fine-tuned for Nigerian English.
- **Phonemizer**: Converts text to IPA.
- **Docker**: Containerization for reproducible deployment.
- **Hugging Face Spaces**: Cloud hosting for public demos.

---

## Demo

> **Live Demo:** [Hugging Face Spaces - Voxpreference](https://huggingface.co/spaces/thebickersteth/voxpreference)  

---

## Quickstart

### Running Locally (Docker)

1. **Clone the repository:**
   ```bash
   git clone https://huggingface.co/spaces/thebickersteth/voxpreference
   cd voxpreference
   ```

2. **Build the Docker image:**
   ```bash
   docker build -t voxpreference .
   ```

3. **Run the container:**
   ```bash
   docker run -p 7860:7860 voxpreference
   ```

4. **Access the API:**
   - Open [http://localhost:7860](http://localhost:7860) in your browser or use `curl`/Postman.

### Running on Hugging Face Spaces

1. **Push your repository to Hugging Face Spaces** (with `sdk: docker` in your README).
2. **Spaces will automatically build and run your Dockerfile.**
3. **Access your app via the provided URL.**

---

## API Reference

### Root Endpoint `/`

- **Method:** `GET`
- **Description:** Welcome message and basic info.
- **Response:**
  ```json
  {
    "message": "Welcome! This API is for transcription. Try /health or /transcribe."
  }
  ```

### Health Endpoint `/health`

- **Method:** `GET`
- **Description:** Health check for monitoring.
- **Response:**
  ```json
  {
    "status": "ok"
  }
  ```

### Transcription Endpoint `/` (POST)

- **Method:** `POST`
- **Description:** Upload an audio file (WAV/MP3) and receive transcription and IPA.
- **Request:**
  - **Form field:** `audioFile` (file upload)
- **Response:**
  ```json
  {
    "success": true,
    "transcription": "recognized text",
    "ipa": "ˌɪn.təˈnæʃ.ə.nəl fəˈnɛ.tɪk ˈælfəˌbɛt",
    "ipa_error": null
  }
  ```
  - If an error occurs:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```

#### Example `curl` Request

```bash
curl -X POST "http://localhost:7860/" \
  -F "audioFile=@/path/to/your/audio.wav"
```

---

## Environment Variables

- `LOG_LEVEL`: Set the logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`). Default: `INFO`.
- `HF_HOME`: Path for Hugging Face cache (default: `/app/hf_home`).
- `TRANSFORMERS_CACHE`: Path for Transformers model cache (default: `/app/cache`).
- `NUMBA_CACHE_DIR`: Path for Numba cache (default: `/app/numba_cache`).

---

## Logging

- Logs are output to stdout (visible in Docker logs and Hugging Face Spaces).
- Log format:  
  `YYYY-MM-DD HH:MM:SS | LEVEL | voxpreference.app | message`
- All requests, responses, and errors are logged.
- Set `LOG_LEVEL=DEBUG` for verbose output.

---

## Cache and Storage Management

- **No audio files are saved to disk**; all processing is in-memory.
- Model and Hugging Face caches are stored in `/app/hf_home` and `/app/cache`.
- On startup, cache directories can be cleaned to avoid storage bloat (see `app.py` for details).
- **Tip:** Monitor disk usage on Hugging Face Spaces to avoid exceeding quotas.

---

## Development

### Requirements

- Python 3.9+
- See `requirements.txt` for dependencies.

### Local Development (without Docker)

1. **Create a virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the app:**
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 7860
   ```

---

## Finetuning the Model

- See `finetune_model.py` for scripts and instructions to finetune the Wav2Vec2 model on your own Nigerian English dataset.
- Training data should be in CSV format with columns for audio file paths and transcripts.
- The script uses Hugging Face `datasets` and `transformers` libraries.
V
---

## Troubleshooting

- **Model Download Issues:** Ensure your Hugging Face token (if needed) is set up and the model is public.
- **Out of Disk Space:** Clean up `/app/hf_home` and `/app/cache` or increase your Hugging Face Space storage.
- **Audio Format Errors:** Only WAV/MP3 files with 16kHz sample rate are supported.
- **Performance:** For large files or high concurrency, consider scaling or optimizing the Docker resource limits.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Hugging Face](https://huggingface.co/) for model hosting and Spaces.
- [FastAPI](https://fastapi.tiangolo.com/) for the web framework.
- [Transformers](https://github.com/huggingface/transformers) for the ASR model.
- [Phonemizer](https://github.com/bootphon/phonemizer) for IPA conversion.
- Nigerian English speech community for data and inspiration.

