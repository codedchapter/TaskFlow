# TaskFlow API (Backend)

A production grade, asynchronous Task Management API built with FastAPI, SQLAlchemy 2.0, and MySQL.

## 🛠️ Tech Stack
- **Framework:** FastAPI
- **Database:** MySQL (via `asyncmy` async driver)
- **ORM:** SQLAlchemy 2.0 (Async)
- **Migrations:** Alembic
- **Package Manager:** `uv`
- **Validation:** Pydantic V2

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.13+
- `uv` package manager installed
- A running MySQL database or PostgreSQL

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/codedchapter/TaskFlow.git
cd TaskFlow/backend

# Install dependencies using uv
uv sync
