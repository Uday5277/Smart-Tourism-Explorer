# 🌍 Smart Tourism Explorer
### A Database-Centric Travel Recommendation Platform

Smart Tourism Explorer is a **full-stack, database-driven travel recommendation system** designed to explore cities, hotels, attractions, and transport options efficiently.  
The project emphasizes **relational database design, stored procedures, caching, and production deployment**, rather than UI complexity.

---

## 🎯 Project Objective

To design and deploy a **scalable travel exploration system** where:
- Core business logic resides inside the database
- Backend acts as a thin orchestration layer
- Performance is optimized using indexing and caching
- External travel data is ingested reliably

---

## 🏗️ System Architecture

Client (React)
↓
Backend API (Node.js / Express)
↓
PostgreSQL (Functions, Triggers, Indexes)
↓
Redis (Read-through Cache)


---

## 🧩 Technology Stack

### Backend
- Node.js (ESM)
- Express.js
- PostgreSQL (`pg`)

### Database
- PostgreSQL 15
- Stored Procedures (PL/pgSQL)
- Triggers & Audit Logs
- Normalized Relational Schema

### Cache
- Redis (read-through caching with TTL)

### Frontend
- React

### DevOps
- Docker
- Docker Compose
- Environment-based configuration

---

## 🗄️ Database Design (Core Strength)

### 🔹 Schema Characteristics
- Fully normalized relational schema
- Strong use of **foreign keys**
- Indexed read-heavy columns
- Business logic implemented in SQL, not JavaScript

### 🔹 Core Tables
- `cities`
- `hotels`
- `attractions`
- `transport`
- `users`
- `bookings`
- `reviews`

### 🔹 Staging Tables
Used for ingesting third-party API data before normalization:
- `staging_cities`
- `staging_places`

This prevents polluting core tables with raw external data.

---

## ⚙️ Stored Procedures (Business Logic)

The application relies on PostgreSQL **functions** for all recommendation logic.

Examples:
- `get_hotels_by_city(city_id)`
- `get_top_hotels_by_city(city_id)`
- `get_attractions_by_city(city_id)`
- `get_top_attractions(city_id)`
- `get_transport_by_city(city_id)`
- `get_cheapest_transport(city_id)`

✔ Backend never re-implements business logic  
✔ Ensures consistency and performance  
✔ Easier to optimize at DB level

---

## 🔁 Triggers & Audit Logging

Triggers are used to:
- Track changes in critical tables
- Maintain audit logs for updates and inserts
- Enforce consistency automatically at DB level

This demonstrates **database-first engineering**.

---

## ⚡ Performance Optimization

### 🔹 Indexing
Indexes added on:
- `city_id`
- `entity_id`
- `user_id`

This improves recommendation query performance significantly as data grows.

### 🔹 Redis Caching
- Read-heavy queries cached using Redis
- TTL-based invalidation (15 minutes)
- Cache keys scoped by city and entity type

Example:
 hotels:city:151
attractions:top:city:151
transport:cheapest:city:151


If Redis is unavailable, the system **gracefully falls back to PostgreSQL**.

---

## 🌐 External Data Ingestion

Travel data is fetched using **GeoApify API**.

### Ingestion Strategy
1. Fetch data via API
2. Store raw results in staging tables
3. Normalize and insert into core tables
4. Avoid duplicates using constraints

This ensures:
- Data integrity
- Controlled ingestion
- Easier debugging

---

## 🚀 Running the Project Locally (Docker)

### 🔹 Prerequisites
- Docker
- Docker Compose

---

### 🔹 Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/smart-tourism-explorer.git
cd smart-tourism-explorer

**Environment Configuration**

Create a .env file in the root directory:

DATABASE_URL=postgresql://postgres:postgres@postgres:5432/tourism
REDIS_URL=redis://redis:6379
PORT=5000

docker-compose up --build

**Restore Database Data**

If you have an existing database dump:

docker exec -i smart-tourism-postgres psql -U postgres -d tourism < tourism_backup.sql
