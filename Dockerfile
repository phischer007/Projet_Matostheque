# ---------------------------------------------------------------------------------------------
# Stage 1: Base build stage
# ---------------------------------------------------------------------------------------------
FROM python:3.13-slim AS builder

RUN mkdir /app
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev libldap2-dev libsasl2-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip setuptools wheel
COPY requirements.txt /app/ 
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------------------------------------------------------------------------
# Stage 2: Production stage
# ---------------------------------------------------------------------------------------------
FROM python:3.13-slim

RUN apt-get update && apt-get install -y --no-install-recommends libpq5 nginx \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -r appuser && \
   mkdir /app && \
   chown -R appuser /app

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

WORKDIR /app
COPY --chown=appuser:appuser . .

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

USER appuser

RUN mkdir -p /app/assets /app/media && \
    chown -R appuser:appuser /app/assets /app/media

EXPOSE 8030

RUN chmod +x /app/entrypoint.prod.sh

ENTRYPOINT ["bash", "/app/entrypoint.prod.sh"]