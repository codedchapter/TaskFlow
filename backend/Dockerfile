FROM python:3.13-slim

WORKDIR /app

# Build tools in case asyncmy has no prebuilt wheel for 3.13
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ pkg-config default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev

COPY . .

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
