FROM python:3.10.9

RUN apt-get update && apt-get install -y espeak && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/hf_home && chmod -R 777 /app/hf_home

RUN mkdir -p /app/numba_cache && chmod -R 777 /app/numba_cache

COPY . .

WORKDIR /

ENV HF_HOME=/app/hf_home

ENV NUMBA_CACHE_DIR=/app/numba_cache

RUN pip install --no-cache-dir --upgrade -r /requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
