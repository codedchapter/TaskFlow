# TaskFlow 🚀

**A modern, full-stack Task and Project Management application built for collaborative, multi-tenant teams.**

TaskFlow is designed to simplify project organization, task tracking, and team collaboration through a scalable backend architecture and a modern frontend experience.

> **Project Status: Phase 1 — Backend Development**
>
> The backend API is currently under development. Phase 2 (Next.js Frontend) is planned and will begin after the backend foundation is established.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Roadmap](#-development-roadmap)
- [Contributing](#-contributing)

---

## Overview

TaskFlow is a multi-tenant task and project management platform designed to help teams manage their work efficiently.

The application aims to provide:

- **Multi-Tenancy:** Support for multiple teams and organizations within a single application.
- **Task Management:** Create, update, organize, and track tasks.
- **Project Management:** Manage projects and monitor their progress.
- **Authentication:** Secure user authentication using JWT.
- **Role-Based Access Control (RBAC):** Manage permissions based on user roles.
- **Scalable Architecture:** An asynchronous backend designed for maintainability and future expansion.

---

## Architecture

TaskFlow follows a **Monorepo architecture**, keeping the backend and frontend in a single repository.

### Project Structure

```text
taskflow/
│
├── backend/
│   ├── app/                 # Application source code
│   ├── alembic/
│   ├── pyproject.toml
│   └── README.md
│
├── frontend/                # Next.js Frontend (Phase 2)
│
├── .gitignore
└── README.md
```

---

## Tech Stack

### Backend — Current Focus

| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | Modern, high-performance Python API framework |
| [Python 3.13+](https://www.python.org/) | Backend programming language |
| [MySQL](https://www.mysql.com/) | Relational database |
| [SQLAlchemy 2.0](https://www.sqlalchemy.org/) | Asynchronous ORM |
| [asyncmy](https://github.com/long2ice/asyncmy) | Asynchronous MySQL driver |
| [Alembic](https://alembic.sqlalchemy.org/) | Database migration management |
| [Pydantic V2](https://docs.pydantic.dev/) | Data validation and serialization |
| [uv](https://docs.astral.sh/uv/) | Python package and project management |

### Frontend — Planned (Phase 2)

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework (App Router) |
| [React](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Zustand](https://zustand.docs.pmnd.rs/) | Client-side state management |
| [TanStack Query](https://tanstack.com/query/latest) | Server-state management and data fetching |

---

## Getting Started

The project is currently focused on backend development. The frontend has not yet been initialized.

To get started, follow the backend setup instructions.

### Prerequisites

Make sure you have the following installed:

- Python 3.13+
- MySQL 8.0+ 0r PostgresSQL
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- Git

### Clone the Repository

```bash
git clone https://github.com/codedchapter/TaskFlow.git

cd TaskFlow
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install project dependencies:

```bash
uv sync
```

Configure your environment variables and database connection according to the backend documentation.

Run database migrations and start the development server using the instructions provided in the backend README.

> **Backend Documentation:** See [`backend/README.md`](./backend/README.md) for detailed installation, configuration, database setup, and API instructions.

---

## Development Roadmap

TaskFlow is being developed incrementally, with the backend foundation taking priority.

### Phase 1 — Backend API

- [x] Initialize FastAPI project with `uv`
- [x] Establish project structure
- [x] Configure asynchronous SQLAlchemy 2.0
- [x] Integrate MySQL using `asyncmy`
- [x] Configure Alembic database migrations
- [x] Implement Task CRUD endpoints (with pagination, filtering, and soft deletes)
- [x] Add Pydantic V2 request and response schemas
- [x] Implement user authentication (JWT & bcrypt)
- [x] Implement custom middleware (Logging, Rate Limiting, Auth Tracking)
- [ ] Implement Role-Based Access Control (RBAC)
- [ ] Develop multi-tenant data isolation

### Phase 2 — Frontend Development

- [x] Initialize Next.js with App Router
- [x] Configure TypeScript and Tailwind CSS
- [x] Build reusable UI components (Button, Input, Container)
- [x] Implement authentication and protected routes
- [x] Integrate backend APIs
- [x] Build task management dashboard (Create, Read, Update, Delete)
- [ ] Implement state management with Zustand / TanStack Query

### Phase 3 — Deployment & Infrastructure

- [ ] Dockerize backend and frontend
- [ ] Configure Docker Compose
- [ ] Set up CI/CD pipelines
- [ ] Implement automated testing
- [ ] Configure production deployment
- [ ] Add logging and monitoring

---

## Contributing

Contributions, suggestions, and feedback are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m " add your feature"
   ```

4. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

---

## License

This project is currently under development. License information will be added in a future release.

---

**Built with FastAPI, Python, and modern web technologies.**

If you find TaskFlow interesting, consider giving the repository a star.
