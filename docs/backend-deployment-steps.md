# Pixanzo Backend Deployment Guide

## Server Details

- **Cloud Provider:** Hetzner Cloud
- **Server:** CPX12 (1 vCPU, 2GB RAM)
- **Operating System:** Ubuntu 24.04 LTS
- **Backend:** FastAPI
- **Frontend:** Vercel
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot)

---

# 1. Connect to the VPS

```bash
ssh root@<SERVER_IP>
```

Example:

```bash
ssh root@157.180.85.31
```

---

# 2. Update Ubuntu

```bash
apt update
apt upgrade -y
```

---

# 3. Install Git

```bash
apt install git -y
```

---

# 4. Install Docker

## Install prerequisites

```bash
apt install -y ca-certificates curl gnupg lsb-release
```

## Add Docker GPG Key

```bash
install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
gpg --dearmor -o /etc/apt/keyrings/docker.gpg

chmod a+r /etc/apt/keyrings/docker.gpg
```

## Add Docker Repository

```bash
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## Install Docker

```bash
apt update

apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify installation

```bash
docker --version
docker compose version
```

---

# 5. Create Project Directory

```bash
mkdir -p /opt/pixanzo
cd /opt/pixanzo
```

---

# 6. Clone Repository

```bash
git clone https://github.com/rohithbharti/imglio.git
```

Go inside project

```bash
cd imglio
```

---

# 7. Create Environment File

```bash
cp .env.example .env
```

Edit

```bash
nano .env
```

Update all required environment variables.

---

# 8. Deploy Backend

Build and run Docker

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

# 9. Verify Deployment

Running containers

```bash
docker ps
```

Application logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

Backend logs only

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

---

# 10. Verify Backend

```bash
curl http://localhost:8000/api/config
```

Expected Response

```json
{
    ...
}
```

---

# 11. Install Nginx

```bash
apt install nginx certbot python3-certbot-nginx -y
```

---

# 12. Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

# 13. Configure Nginx

Create configuration

```bash
cat > /etc/nginx/sites-available/api.pixanzo.com << 'EOF'
server {
    listen 80;
    server_name api.pixanzo.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:8000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
    }
}
EOF
```

Enable site

```bash
ln -s /etc/nginx/sites-available/api.pixanzo.com /etc/nginx/sites-enabled/
```

Remove default configuration

```bash
rm /etc/nginx/sites-enabled/default
```

Verify configuration

```bash
nginx -t
```

Restart Nginx

```bash
systemctl restart nginx
systemctl enable nginx
```

---

# 14. Configure DNS

Create the following DNS record.

| Type | Host | Value |
|------|------|------|
| A | api | <SERVER_IP> |

Example

| Type | Host | Value |
|------|------|------|
| A | api | 157.180.85.31 |

---

# 15. Install SSL Certificate

```bash
certbot --nginx -d api.pixanzo.com
```

Choose

```
2 (Redirect HTTP to HTTPS)
```

Verify

```
https://api.pixanzo.com/api/config
```

---

# 16. Update Frontend

Update Vercel Environment Variable

```
NEXT_PUBLIC_API_URL=https://api.pixanzo.com
```

Redeploy frontend.

---

# 17. Docker Commands

### Build

```bash
docker compose -f docker-compose.prod.yml build
```

### Start

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Stop

```bash
docker compose -f docker-compose.prod.yml down
```

### Restart

```bash
docker compose -f docker-compose.prod.yml restart
```

### Rebuild

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Running Containers

```bash
docker ps
```

### Logs

```bash
docker compose -f docker-compose.prod.yml logs -f
```

### Backend Logs

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

### Enter Container

```bash
docker exec -it imglio_backend bash
```

### Environment Variables

```bash
docker exec -it imglio_backend printenv
```

Specific variable

```bash
docker exec -it imglio_backend printenv | grep FRONTEND
```

---

# 18. Verify CORS

```bash
curl -i \
-H "Origin: https://pixanzo.com" \
https://api.pixanzo.com/api/config
```

Expected Response Header

```
Access-Control-Allow-Origin: https://pixanzo.com
```

---

# Final Architecture

```text
                    Internet
                         │
                         │
                 https://pixanzo.com
                         │
                      Vercel
                  Next.js Frontend
                         │
                         │ HTTPS
                         ▼
                https://api.pixanzo.com
                         │
                      Nginx
                         │
                         ▼
                FastAPI (Docker)
                         │
                         ▼
              SQLite / PostgreSQL
                         │
                  Persistent Volume
```

## Technology Stack

- Ubuntu 24.04 LTS
- Hetzner Cloud
- Docker
- Docker Compose
- FastAPI
- Nginx
- Let's Encrypt
- Vercel
- GitHub
- SQLite / PostgreSQL