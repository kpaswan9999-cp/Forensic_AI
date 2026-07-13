FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for some ML/NLP libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Download Spacy model as it might be needed for NLP
RUN python -m spacy download en_core_web_sm || true

# Copy source code
COPY . /app/backend

# Set python path
ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
