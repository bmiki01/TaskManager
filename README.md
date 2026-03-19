# TaskManager

A modern, full-stack Task Management application designed to help users organize and track their projects and tasks efficiently. Built with a Java Spring Boot backend and a responsive React frontend, everything is fully containerized using Docker for seamless deployment and consistency across environments.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication
- **Modern UI**: Clean, responsive frontend built with React, Vite, and Tailwind CSS
- **RESTful API**: Comprehensive backend API documented with Swagger/OpenAPI
- **Database**: Reliable PostgreSQL database for robust data persistence
- **Containerized**: Fully Dockerized setup (Frontend, Backend, Database) for easy "one-command" setup

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Java 17, Spring Boot 3.2.4
- **ORM**: Spring Data JPA
- **Security**: Spring Security, JJWT (JWT Authentication)
- **API Docs**: SpringDoc OpenAPI (Swagger UI)
- **Database Driver**: PostgreSQL

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Database**: PostgreSQL 15-alpine

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Execution

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd TaskManager
   ```

2. **Build and start the application** using Docker Compose:
   ```bash
   docker compose up --build
   ```
   This will automatically build and spin up three containers: `taskmanager-db`, `taskmanager-backend`, and `taskmanager-frontend`.

3. **Access the Application**:
   - **Frontend UI**: [http://localhost](http://localhost) (runs on port 80)
   - **Backend API**: [http://localhost:8080](http://localhost:8080)
   - **Swagger API Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## 📁 Project Structure

```
TaskManager/
├── frontend/             # React SPA (Vite + TS + Tailwind)
│   ├── src/              # Source code, components, views
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── Dockerfile        # Frontend Docker image config
├── backend/              # Spring Boot Application
│   ├── src/main/java/    # Java source code
│   ├── src/main/resources# Application properties
│   ├── pom.xml           # Backend dependencies (Maven)
│   └── Dockerfile        # Backend Docker image config
└── docker-compose.yml    # Multi-container orchestration
```

## 🔐 Environment Variables

The application relies on environment variables configured in `docker-compose.yml`. For production deployments, these should be externalized, but currently, they are set up out-of-the-box for local testing.

