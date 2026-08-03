# GitHub Actions CI/CD Deployment for Pixanzo Backend

## Overview

This setup enables automatic deployment of the backend whenever code is pushed to the `main` branch.

### Deployment Flow

```text
Developer
    │
git push origin main
    │
    ▼
GitHub Repository
    │
GitHub Actions
    │
SSH
    │
    ▼
Hetzner VPS
    │
git pull
docker compose up -d --build
    │
    ▼
Backend Updated
```

---

# 1. Generate SSH Key

On your local machine

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

Press Enter for all default prompts.

---

# 2. Verify Generated Keys

Private Key

```bash
cat ~/.ssh/id_ed25519
```

Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```

---

# 3. Add Public Key to VPS

SSH into the VPS

```bash
ssh root@<SERVER_IP>
```

Create SSH directory if not present

```bash
mkdir -p ~/.ssh
```

Open authorized keys

```bash
nano ~/.ssh/authorized_keys
```

Paste the **public key**.

Set permissions

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

# 4. Verify Passwordless Login

From your local machine

```bash
ssh root@<SERVER_IP>
```

You should log in without entering the VPS password.

---

# 5. Create GitHub Repository Secrets

Navigate to

```
Repository
    ↓
Settings
    ↓
Secrets and variables
    ↓
Actions
    ↓
Repository secrets
```

Create the following secrets.

| Secret Name | Value |
|-------------|-------|
| SERVER_HOST | VPS Public IP |
| SERVER_SSH_KEY | Complete Private SSH Key |

Example

```
SERVER_HOST
157.180.85.31
```

```
SERVER_SSH_KEY

-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

> **Never commit or share the private key.**

---

# 6. Create GitHub Workflow

Create directories

```text
.github/
└── workflows/
    └── deploy.yml
```

---

# 7. Create deploy.yml

```yaml
name: Deploy Backend

on:
  push:
    branches:
      - main
    paths:
      - "backend/**"
      - "docker-compose.prod.yml"
      - ".github/workflows/deploy.yml"

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.2.2

        with:
          host: ${{ secrets.SERVER_HOST }}
          username: root
          key: ${{ secrets.SERVER_SSH_KEY }}

          script: |
            cd /opt/pixanzo/imglio

            git pull origin main

            docker compose -f docker-compose.prod.yml up -d --build

            docker image prune -f
```

---

# 8. Commit Workflow

```bash
git add .github/workflows/deploy.yml

git commit -m "Add backend deployment workflow"

git push origin main
```

---

# 9. Monitor Deployment

Open GitHub

```
Repository
    ↓
Actions
```

Select

```
Deploy Backend
```

You can monitor every deployment step in real time.

---

# 10. Verify Latest Commit on VPS

```bash
ssh root@<SERVER_IP>

cd /opt/pixanzo/imglio

git log --oneline -1
```

Verify that the latest commit matches the one you pushed.

---

# 11. Verify Docker

Running containers

```bash
docker ps
```

Docker compose status

```bash
docker compose -f docker-compose.prod.yml ps
```

Backend logs

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

---

# 12. Verify Backend

```bash
curl https://api.pixanzo.com/api/config
```

Expected Response

```json
{
    ...
}
```

---

# 13. Test Automatic Deployment

Modify any backend file.

Example

```python
return {
    "version": "1.0.1"
}
```

Commit

```bash
git add .

git commit -m "Test deployment"

git push origin main
```

Observe

```
GitHub Actions
        ↓
Deployment Started
        ↓
SSH into VPS
        ↓
git pull
        ↓
docker compose up -d --build
        ↓
Deployment Completed
```

Verify

```bash
curl https://api.pixanzo.com/api/config
```

The response should contain the updated changes.

---

# Repository Structure

```text
imglio/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── backend/
│
├── frontend/
│
├── nginx/
│
├── docker-compose.yml
│
├── docker-compose.prod.yml
│
└── README.md
```

---

# Useful Commands

## Check latest deployment

```bash
git log --oneline -1
```

---

## Running containers

```bash
docker ps
```

---

## Restart backend

```bash
docker compose -f docker-compose.prod.yml restart
```

---

## Rebuild backend

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Backend logs

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

---

## Enter backend container

```bash
docker exec -it imglio_backend bash
```

---

# Final CI/CD Architecture

```text
                Developer
                     │
             git push origin main
                     │
                     ▼
            GitHub Repository
                     │
                     ▼
             GitHub Actions
                     │
                     ▼
              SSH (Private Key)
                     │
                     ▼
              Hetzner VPS
                     │
             git pull origin main
                     │
                     ▼
     docker compose up -d --build
                     │
                     ▼
             FastAPI Backend
                     │
                     ▼
                  Nginx
                     │
                     ▼
          https://api.pixanzo.com
```

## Benefits

- Automatic deployment
- No manual SSH deployment
- No manual Docker rebuild
- Version-controlled deployment pipeline
- Secure authentication using SSH keys
- Easily extensible for staging and production environments