

Spaceship (Domain)
        │
Cloudflare
        │
──────────────
│            │
Vercel       AWS
Frontend     Backend
             │
     PostgreSQL
             │
    Cloudflare R2


Repository:

pixanzo/
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production (single server)
├── nginx/
└── .env

Backend deployment 

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
                     Nginx (443)
                         │
                         ▼
                FastAPI Docker (8000)
                         │
                         ▼
              SQLite / PostgreSQL
                         │
                  Persistent Volume