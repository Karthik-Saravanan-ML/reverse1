import os

project_root = r"C:\Users\Karthik\Downloads\CRM"

files = {
    # ROOT
    "docker-compose.yml": """version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  ollama:
    image: ollama/ollama
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"

  backend:
    build:
      context: ./backend
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=${DB_NAME}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - minio

  ai-service:
    build:
      context: ./ai-service
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - OLLAMA_BASE_URL=http://ollama:11434
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - minio
      - ollama

  frontend:
    build:
      context: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8080

volumes:
  postgres_data:
  minio_data:
  ollama_data:
""",
    "docker-compose.override.yml": """version: '3.8'
services:
  backend:
    volumes:
      - ./backend:/app
  frontend:
    volumes:
      - ./frontend:/app
      - /app/node_modules
""",
    ".env.example": """DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=supersecretjwtkeythatislongenoughforhs256andsecure
JWT_EXPIRY_MS=86400000
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=admin123
MINIO_BUCKET=crm-documents
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
OPENAI_API_KEY=
EMBEDDING_MODEL=all-MiniLM-L6-v2
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=user
MAIL_PASSWORD=pass
FRONTEND_URL=http://localhost:5173
INVITATION_EXPIRY_HOURS=72
PASSWORD_RESET_EXPIRY_HOURS=24
""",
    ".gitignore": """node_modules/
dist/
build/
target/
*.class
.env
__pycache__/
*.pyc
venv/
.idea/
.vscode/
""",
    "README.md": "# AI-Native CRM Platform\n",
    "init-scripts/init.sql": """CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
""",

    # BACKEND FILES
    "backend/pom.xml": """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>
    <groupId>com.crm</groupId>
    <artifactId>backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>backend</name>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-websocket</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-mail</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
        <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
        <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
        <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
        <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>0.12.3</version></dependency>
        <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>0.12.3</version><scope>runtime</scope></dependency>
        <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>0.12.3</version><scope>runtime</scope></dependency>
        <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
        <dependency><groupId>org.mapstruct</groupId><artifactId>mapstruct</artifactId><version>1.5.5.Final</version></dependency>
        <dependency><groupId>io.minio</groupId><artifactId>minio</artifactId><version>8.5.7</version></dependency>
        <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId><version>2.3.0</version></dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
        </plugins>
    </build>
</project>
""",
    "backend/src/main/resources/application.yml": """spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
  mail:
    host: ${MAIL_HOST}
    port: ${MAIL_PORT}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
server:
  port: 8080
""",
    "backend/src/main/java/com/crm/CrmApplication.java": """package com.crm;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmApplication {
    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }
}
""",
    "backend/Dockerfile": """FROM maven:3.9.5-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
""",
    
    # DB MIGRATIONS
    "backend/src/main/resources/db/migration/V1__create_extensions.sql": """CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
""",
    "backend/src/main/resources/db/migration/V2__create_users_and_auth.sql": """
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, role_id)
);
""",
    "backend/src/main/resources/db/migration/V3__create_organizations_and_clients.sql": """
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
""",
    "backend/src/main/resources/db/migration/V4__create_projects.sql": """
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50)
);
""",
    "backend/src/main/resources/db/migration/V5__create_tasks.sql": """
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    assignee_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
""",
    "backend/src/main/resources/db/migration/V6__create_communication.sql": """
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
""",
    "backend/src/main/resources/db/migration/V7__create_meetings.sql": """
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
""",
    "backend/src/main/resources/db/migration/V8__create_documents.sql": """
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255),
    file_path VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT,
    embedding vector(384)
);
""",
    "backend/src/main/resources/db/migration/V9__create_memory.sql": """
CREATE TABLE memory_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    type VARCHAR(50),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
""",
    "backend/src/main/resources/db/migration/V10__create_notifications_activity_audit.sql": """
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
""",
    "backend/src/main/resources/db/migration/V11__seed_initial_data.sql": """
INSERT INTO roles (name) VALUES ('ADMIN'), ('MANAGER'), ('EMPLOYEE'), ('CLIENT');
""",

    # AI SERVICE FILES
    "ai-service/requirements.txt": """fastapi
uvicorn
sqlalchemy
asyncpg
psycopg2-binary
pgvector
langchain
langchain-community
langchain-openai
sentence-transformers
pymupdf
python-docx
pillow
python-multipart
pydantic-settings
httpx
ollama
python-jose[cryptography]
""",
    "ai-service/Dockerfile": """FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "ai-service/main.py": """from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
""",
    "ai-service/config.py": """from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "crm_db"
    
    class Config:
        env_file = ".env"

settings = Settings()
""",
    
    # FRONTEND FILES
    "frontend/package.json": """{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.2",
    "tailwindcss": "^3.3.5",
    "lucide-react": "^0.294.0",
    "zustand": "^4.4.7",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}
""",
    "frontend/vite.config.js": """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://backend:8080'
    }
  }
})
""",
    "frontend/tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
""",
    "frontend/Dockerfile": """FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
"""
}

# Also creating the package directories for Java and Python to satisfy the instructions.
directories = [
    "backend/src/main/java/com/crm/config",
    "backend/src/main/java/com/crm/common",
    "backend/src/main/java/com/crm/auth",
    "backend/src/main/java/com/crm/users",
    "backend/src/main/java/com/crm/clients",
    "backend/src/main/java/com/crm/projects",
    "backend/src/main/java/com/crm/teams",
    "backend/src/main/java/com/crm/tasks",
    "backend/src/main/java/com/crm/communication",
    "backend/src/main/java/com/crm/meetings",
    "backend/src/main/java/com/crm/documents",
    "backend/src/main/java/com/crm/memory",
    "backend/src/main/java/com/crm/notifications",
    "backend/src/main/java/com/crm/audit",
    "backend/src/main/java/com/crm/admin",
    "ai-service/ingestion",
    "ai-service/embeddings",
    "ai-service/vector_store",
    "ai-service/memory",
    "ai-service/retrieval",
    "ai-service/rag",
    "ai-service/llm",
    "ai-service/auth",
    "ai-service/api",
    "ai-service/models",
    "frontend/src/api",
    "frontend/src/components/ui",
    "frontend/src/components/layout",
    "frontend/src/components/shared",
    "frontend/src/pages/auth",
    "frontend/src/pages/admin",
    "frontend/src/pages/manager",
    "frontend/src/pages/employee",
    "frontend/src/pages/client",
    "frontend/src/pages/project",
    "frontend/src/hooks",
    "frontend/src/store",
    "frontend/src/utils",
    "frontend/src/types",
    "docs"
]

for d in directories:
    os.makedirs(os.path.join(project_root, d), exist_ok=True)

for rel_path, content in files.items():
    full_path = os.path.join(project_root, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Files generated successfully.")
