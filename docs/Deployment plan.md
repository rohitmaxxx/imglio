

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