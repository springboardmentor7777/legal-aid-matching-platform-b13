# db_files 

This folder holds database-related artifacts: SQL dumps, migration scripts, seeds, local DB configs, and helper tools.

Overview
- Stores migrations and sample/seed data required to create or restore development and production databases.

For collaborators (who to contact / responsibilities)
- DB engineers: maintain migration scripts, DB schema changes, and ensure backwards-compatible migrations.
- Backend devs: update entity mappings and migration scripts when changing models.
- DevOps: manage production backups, restore procedures, and DB provisioning.

Database types
- Production: PostgreSQL (primary). Development: SQLite allowed for lightweight local runs; run migrations against Postgres when preparing integration tests.

Common tasks
- Apply migrations (example using Flyway configured in the backend): let Spring run migrations on startup or use the Flyway CLI.
- Restore a Postgres SQL dump locally:

	psql -U <user> -d <dbname> -f path/to/dump.sql

- Create a dump (Postgres):

	pg_dump -U <user> -d <dbname> -F c -b -v -f backup_name.dump

- For SQLite: simply copy the `dev.db` file, but avoid committing production data.

Seeding and test data
- Use the seeds folder or migration `V` scripts to insert deterministic test data for local development and CI.

Conventions & safety
- Migrations must be idempotent and include versioned filenames (Flyway/Liquibase conventions).
- Never commit production credentials or PII. Mask or remove sensitive data from committed dumps.

CI / Backup
- CI should run migrations and seed a test DB before integration tests.
- Document restore steps and retention policy for backups in the project wiki or ops docs.

Where to find more info
- See `backend` configuration for datasource settings and migration tool configuration.
