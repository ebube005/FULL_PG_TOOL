FROM python:3.10-slim

WORKDIR /app

RUN ls -lR /app

COPY . .

RUN ls -lR /app

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/logs

EXPOSE 7860

ENV PYTHONPATH="${PYTHONPATH}:/app/backend"

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"] 