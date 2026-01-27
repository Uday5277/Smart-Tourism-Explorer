## Database Seed & Ingestion

This folder contains sample datasets and ingestion scripts used to populate the PostgreSQL database.

### Contents
- CSV files: Initial seed data for cities, hotels, attractions, transport, users, and reviews
- fetchPlaces.js: Script to ingest external travel data from GeoApify API into staging tables

### Notes
- CSV files are used only for development and testing
- Core business logic resides in PostgreSQL functions and triggers
- Production deployments rely on managed PostgreSQL instances
