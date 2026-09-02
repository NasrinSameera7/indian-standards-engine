# Indian Standards Recommendation Engine

A semantic search and recommendation engine for Indian Standards (BIS).

## Features
- Semantic Search using Vector Embeddings (FAISS)
- Multilingual Query Support
- Allied Standards Recommendations
- Automated Specifications Document Generation (PDF/DOCX)
- Audit Trails

## Architecture
(Add Architecture Diagram link here)

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16
- Tesseract OCR

## Quick Start (Docker)
1. Run `docker-compose up -d`
2. Backend is available at `http://localhost:8000/docs`
3. Frontend is available at `http://localhost:5173`

## Manual Setup
1. Backend:
   ```
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
2. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

## Seed Data
Run the following script to insert sample standards:
```
cd backend
python -m scripts.seed_standards --data-path ../data/sample_standards.json
```

## API Documentation
Once running, visit `http://localhost:8000/docs` for the interactive API documentation.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, asyncpg
- DB: PostgreSQL
- Search: FAISS, Sentence Transformers
- OCR: Tesseract

## License
MIT License
