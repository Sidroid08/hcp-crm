# AI-First CRM HCP Module

A full-stack Healthcare Professional (HCP) CRM module for life science field representatives. The application focuses on the assignment's Log Interaction screen, where a representative can capture HCP interactions through either a structured form or a conversational AI logger.

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Axios, Tailwind CSS
- Backend: Python, FastAPI, SQLAlchemy
- AI workflow: LangGraph
- LLM provider: Groq with `gemma2-9b-it` or local Ollama with `llama3.2`
- Database: SQLite for local development, PostgreSQL-ready for assignment/demo runs
- Font: Google Inter

## Features

- Dashboard with interaction metrics.
- Log Interaction screen with two modes:
  - Structured Form
  - AI Chat Logger
- Interaction history with search, edit, and delete.
- AI-enriched summaries, sentiment, action items, and next best action.
- LangGraph CRM workflow agent for conversational logging.
- Five demoable LangGraph tools:
  - `log_interaction_tool`
  - `edit_interaction_tool`
  - `summarize_interaction_tool`
  - `extract_action_items_tool`
  - `recommend_next_best_action_tool`
- FastAPI endpoints for CRUD operations and individual AI tool demos.
- Production-minded engineering layer:
  - Isolated backend API tests with pytest.
  - GitHub Actions CI for backend tests and frontend builds.
  - Dockerfiles and Docker Compose for reproducible full-stack runs.
  - Alembic migration scaffold for schema evolution.
  - Health/readiness metadata and frontend API error handling.

## Project Structure

```text
.
|-- backend
|   |-- app
|   |   |-- agents
|   |   |-- api
|   |   |-- core
|   |   |-- db
|   |   |-- models
|   |   |-- schemas
|   |   `-- services
|   |-- requirements.txt
|   |-- .env.example
|   `-- seed_demo_data.py
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- app
|   |   |-- components
|   |   |-- features
|   |   |-- pages
|   |   `-- styles
|   |-- package.json
|   `-- .env.example
|-- .env.example
|-- .gitignore
`-- README.md
```

## Backend Setup

1. Install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Configure environment:

```bash
copy .env.example .env
```

Set these values in `backend/.env`:

```env
DATABASE_URL=sqlite:///./crm_dev.db
LLM_PROVIDER=groq
GROQ_API_KEY=your_new_groq_api_key_here
GROQ_MODEL=gemma2-9b-it
```

For PostgreSQL, create a database named `ai_first_crm` and use:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ai_first_crm
```

To use a local Llama 3.2 model through Ollama instead:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

3. Run the API:

```bash
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`.

4. Seed sample demo data:

```bash
python seed_demo_data.py
```

## Quality Gates

Run backend tests:

```bash
cd backend
python -m pytest
```

Run frontend production build:

```bash
cd frontend
npm run build
```

Run database migrations against a fresh or production database:

```bash
cd backend
python -m alembic upgrade head
```

If you already have a local SQLite database created by the development server, stamp it once instead of recreating tables:

```bash
python -m alembic stamp head
```

## Docker

Build and run the full stack:

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

The Docker setup points Ollama calls to `http://host.docker.internal:11434`, so a local `llama3.2` model can be reused from containers.

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure environment:

```bash
copy .env.example .env
```

3. Run the UI:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## API Documentation

FastAPI documentation is available after starting the backend:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### System

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |

### Interactions

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/interactions` | List interactions |
| `GET` | `/api/interactions/stats` | Dashboard metrics |
| `GET` | `/api/interactions/{interaction_id}` | Get one interaction |
| `POST` | `/api/interactions` | Create interaction |
| `PUT` | `/api/interactions/{interaction_id}` | Update interaction |
| `DELETE` | `/api/interactions/{interaction_id}` | Delete interaction |

### AI Workflow

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/ai/chat` | Conversational AI logging through LangGraph |
| `POST` | `/api/ai/tools/log-interaction` | Demo Log Interaction Tool |
| `POST` | `/api/ai/tools/edit-interaction` | Demo Edit Interaction Tool |
| `POST` | `/api/ai/tools/summarize-interaction` | Demo Summarize Interaction Tool |
| `POST` | `/api/ai/tools/extract-action-items` | Demo Extract Action Items Tool |
| `POST` | `/api/ai/tools/recommend-next-best-action` | Demo Recommend Next Best Action Tool |

## Example Interaction Payload

```json
{
  "hcp_name": "Dr. Ananya Rao",
  "specialty": "Cardiology",
  "organization": "Apollo Heart Institute",
  "interaction_type": "Clinic Visit",
  "interaction_date": "2026-05-04",
  "products_discussed": ["Cardiostat XR"],
  "notes": "Dr. Rao was receptive and requested outcome data for high-risk patients.",
  "ai_summary": "Positive cardiology discussion focused on Cardiostat XR outcomes data.",
  "sentiment": "Positive",
  "follow_up_required": true,
  "follow_up_date": "2026-05-11",
  "action_items": ["Share approved outcomes data.", "Schedule follow-up discussion."],
  "next_best_action": "Send clinical data and confirm a 15-minute follow-up slot."
}
```

## Example AI Tool Request

```bash
curl -X POST http://localhost:8000/api/ai/tools/log-interaction ^
  -H "Content-Type: application/json" ^
  -d "{\"payload\":{\"hcp_name\":\"Dr. Rao\",\"specialty\":\"Cardiology\",\"organization\":\"Apollo\",\"notes\":\"Interested in data and asked for follow up next week\",\"products_discussed\":[\"Cardiostat XR\"]}}"
```

## Submission Notes

- Do not commit `.env` files or real API keys.
- Generate a new Groq API key before recording the demo if an old key was exposed.
- Use `gemma2-9b-it` for the Groq model in the submitted demo.
- Use PostgreSQL for the assignment run.
