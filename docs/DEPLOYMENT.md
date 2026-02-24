# Deployment Guide — Cosmos (SAJE_N)

This guide covers how to deploy the Cosmos platform to various environments.

## 🐳 Docker (Self-Host) — Recommended

The easiest way to self-host is using Docker Compose. This starts both the web application and the collaboration (Yjs) server.

### Prerequisites

- Docker and Docker Compose
- Minimum 2GB RAM (Next.js build requirement)

### Steps

1. **Clone and Setup**
   ```bash
   git clone https://github.com/Bazzingaby/SAJE_N.git
   cd SAJE_N
   cp .env.example .env
   ```
2. **Configure Environment**
   Edit `.env` to set your desired `NEXT_PUBLIC_COLLAB_SERVER_URL` and AI keys.
3. **Run**
   ```bash
   docker-compose up -d --build
   ```
   The app will be available at `http://localhost:3000`.

---

## ☁️ Vercel (Frontend Only)

You can deploy the Next.js frontend to Vercel, but you will need a separate server for collaboration (Yjs).

1. **Push** your code to a GitHub repository.
2. **Import** to Vercel.
3. **Configure Environment Variables**:
   - `NEXT_PUBLIC_COLLAB_SERVER_URL`: Point to your external Yjs server.
   - `COLLAB_PORT`: (Server-side only)
4. **Deploy**.

---

## 🛠️ Configuration (Env Vars)

| Variable                        | Description              | Default               |
| ------------------------------- | ------------------------ | --------------------- |
| `PORT`                          | Web server port          | `3000`                |
| `COLLAB_PORT`                   | Yjs server port          | `1234`                |
| `NEXT_PUBLIC_COLLAB_SERVER_URL` | WebSocket URL for collab | `ws://localhost:1234` |
| `NODE_ENV`                      | Environment mode         | `production`          |

---

## 🛡️ Security

- **AI Keys**: Never commit API keys. Use the `Settings` UI in the app or server-side environment variables.
- **Sandboxing**: For production data pipelines, consider running workers in isolated containers.
