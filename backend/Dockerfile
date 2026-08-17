# ==========================================
# FastAPI Backend Dockerfile
# Base Image: Python 3.11-slim (Lightweight)
# ==========================================

FROM python:3.11-slim as base

# Set environment variables for Python optimization
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set working directory inside container
WORKDIR /app

# Install system build dependencies required for psycopg2 and C extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Layered Cache: Copy requirements file first
COPY requirements.txt /app/requirements.txt

# Install Python packages
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application source code
COPY . /app/

# Expose FastAPI backend port
EXPOSE 8000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/redis-status || exit 1

# Default execution command
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
