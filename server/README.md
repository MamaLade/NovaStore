# NovaStore Server

Lightweight Express + Prisma (SQLite) backend scaffold for development.

Quick start:

1. cd server
2. npm install
3. Copy `.env.example` to `.env` and adjust values
4. npx prisma generate
5. npx prisma migrate dev --name init
6. npm run seed
7. npm run dev

Seed endpoint: POST /api/admin/seed-products with header `x-seed-key` set to `SEED_KEY` from env.
