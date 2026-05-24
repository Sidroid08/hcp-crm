# AI-First HCP CRM Module

A full-stack CRM module for logging Healthcare Professional (HCP) interactions. The project gives field representatives two ways to capture interaction data: a structured form for standard entries and an AI-assisted chat logger for conversational logging.

The application is designed as an assignment/demo-ready full-stack system with a React frontend, FastAPI backend, database-backed interaction records, LangGraph-powered AI workflows, Docker support, and CI checks.

## Project Overview

Life science field representatives often need to record HCP meetings, summarize discussion points, track follow-ups, and identify the next best action after every interaction. This project models that workflow through a compact CRM module focused on interaction logging and AI-assisted post-call documentation.

The system supports:

- Manual interaction entry through a structured CRM form
- Conversational interaction logging through an AI chat flow
- AI-generated summaries, sentiment, action items, and next-best-action suggestions
- Interaction history with search, edit, and delete capabilities
- Backend APIs for interaction management and AI workflow demos
- Local and containerized development workflows

## Key Features

### CRM Dashboard

- Displays interaction-level metrics
- Provides a central view of logged HCP activity
- Supports quick access to logging and history workflows

### Log Interaction Workflow

- Structured form for standard CRM data entry
- AI Chat Logger for conversational logging
- Captures HCP name, specialty, organization, interaction type, date, products discussed, notes, follow-up details, and AI-enriched outputs

### Interaction History

- View logged HCP interactions
- Search interaction records
- Edit existing entries
- Delete interactions when needed

### AI Workflow

The backend includes a LangGraph-based CRM workflow agent and demoable AI tools for:

- Logging an interaction
- Editing an interaction
- Summarizing notes
- Extracting action items
- Recommending the next best action

Supported LLM providers:

- Groq using `gemma2-9b-it`
- Local Ollama using `llama3.2`

### Engineering and Delivery Layer

- FastAPI backend with typed request/response validation
- SQLAlchemy models and database session management
- SQLite support for local development
- PostgreSQL-ready configuration for more realistic demo runs
- Dockerfiles and Docker Compose for reproducible full-stack execution
- Backend tests with pytest
- GitHub Actions workflow for backend tests and frontend build checks
- Alembic migration scaffold for schema evolution
- Health endpoint for service checks

## Tech Stack

### Frontend

- React 18
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- Uvicorn
- pytest

### AI / LLM Workflow

- LangGraph
- LangChain Core
- LangChain Groq
- LangChain Ollama
- Groq `gemma2-9b-it`
- Ollama `llama3.2`

### Database and Infrastructure

- SQLite for local development
- PostgreSQL-compatible configuration
- Docker
- Docker Compose
- GitHub Actions CI

## Architecture

```text
User
 |
 v
React + Vite Frontend
 |
 |  REST API calls
 v
FastAPI Backend
 |
 |-- Interaction CRUD APIs
 |-- AI Workflow APIs
 |-- Health endpoint
 |
 v
SQLAlchemy Data Layer
 |
 v
SQLite / PostgreSQL-ready Database

AI Workflow Path:
Frontend -> FastAPI -> LangGraph Agent -> Groq or Ollama -> AI-enriched CRM output
```

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
|-- docker-compose.yml
|-- .env.example
|-- .gitignore
`-- README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Python 3.12 or compatible Python 3.x version
- Node.js 20 or compatible Node.js version
- npm
- Docker and Docker Compose, optional but recommended
- Groq API key or local Ollama setup if using AI features

## Backend Setup

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the backend environment file:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Example local SQLite configuration:

```env
DATABASE_URL=sqlite:///./crm_dev.db
LLM_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=gemma2-9b-it
```

Example PostgreSQL configuration:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/ai_first_crm
```

Example local Ollama configuration:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

Seed demo data:

```bash
python seed_demo_data.py
```

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
```

Create the frontend environment file:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Run the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## Running with Docker

Build and run the full stack:

```bash
docker compose up --build
```

Docker services:

```text
Frontend: http://localhost:8080
Backend:  http://localhost:8000
API Docs: http://localhost:8000/docs
```

The Docker setup uses a persistent backend volume and points Ollama requests to:

```text
http://host.docker.internal:11434
```

This allows the containerized backend to reuse a local Ollama model running on the host machine.

## API Documentation

After starting the backend, FastAPI documentation is available at:

```text
Swagger UI: http://localhost:8000/docs
ReDoc:      http://localhost:8000/redoc
```

## API Endpoints

### System

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Service metadata |
| `GET` | `/health` | Health check |

### Interactions

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/interactions` | List interaction records |
| `GET` | `/api/interactions/stats` | Fetch dashboard metrics |
| `GET` | `/api/interactions/{interaction_id}` | Fetch a single interaction |
| `POST` | `/api/interactions` | Create an interaction |
| `PUT` | `/api/interactions/{interaction_id}` | Update an interaction |
| `DELETE` | `/api/interactions/{interaction_id}` | Delete an interaction |

### AI Workflow

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/ai/chat` | Conversational interaction logging through LangGraph |
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

PowerShell / Windows:

```bash
curl -X POST http://localhost:8000/api/ai/tools/log-interaction ^
  -H "Content-Type: application/json" ^
  -d "{\"payload\":{\"hcp_name\":\"Dr. Rao\",\"specialty\":\"Cardiology\",\"organization\":\"Apollo\",\"notes\":\"Interested in data and asked for follow up next week\",\"products_discussed\":[\"Cardiostat XR\"]}}"
```

macOS / Linux:

```bash
curl -X POST http://localhost:8000/api/ai/tools/log-interaction \
  -H "Content-Type: application/json" \
  -d '{"payload":{"hcp_name":"Dr. Rao","specialty":"Cardiology","organization":"Apollo","notes":"Interested in data and asked for follow up next week","products_discussed":["Cardiostat XR"]}}'
```

## Quality Checks

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

Run database migrations:

```bash
cd backend
python -m alembic upgrade head
```

If a local SQLite database was already created during development, stamp the current migration state:

```bash
python -m alembic stamp head
```

## Environment and Security Notes

- Do not commit `.env` files.
- Do not commit API keys or credentials.
- Generate a new Groq API key if any previous key was exposed.
- Use local `.env` files for development secrets.
- Use PostgreSQL for a more realistic demo or assignment run.
- Treat this project as a demo/assignment CRM module, not a production healthcare compliance system.

## Current Limitations

- Authentication and role-based access control are not included in the current README-visible scope.
- The module focuses on interaction logging rather than a complete enterprise CRM suite.
- AI outputs should be reviewed before being used in real business workflows.
- Healthcare compliance controls such as audit trails, access policies, and privacy workflows would be required before any real-world use.

## Suggested Future Improvements

- Add authentication and role-based access control
- Add audit logging for interaction changes
- Add screenshot and demo video sections
- Add deployment instructions for Render, Railway, or a cloud VM
- Add end-to-end tests for the main user workflows
- Add production database configuration examples
- Add stronger validation and error reporting for AI workflow outputs
- Add export options for interaction reports

## Repository Status

This repository is suitable as a full-stack assignment/demo project showing CRM workflow design, backend API development, AI-assisted logging, Docker-based local runs, and CI-backed quality checks.
