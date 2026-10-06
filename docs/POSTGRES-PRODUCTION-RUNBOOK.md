# Proofline PostgreSQL Production Runbook

Proofline is developed locally using SQLite for velocity, but **must** run on PostgreSQL in production to satisfy enterprise requirements for High Availability (HA), Point-in-Time Recovery (PITR), and concurrent `UPDATE` locks for job leasing.

## 1. Migration from SQLite to PostgreSQL

To deploy Proofline to a production environment:

1. In `prisma/schema.prisma`, update the provider:
   ```prisma
   datasource db {
     provider = "postgresql" // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Re-generate Prisma Client:
   ```bash
   npx prisma generate
   ```
3. Apply migrations to the production DB:
   ```bash
   npx prisma migrate deploy
   ```

*Note: You must drop the `prisma/migrations` folder created for SQLite and run `npx prisma migrate dev --name init` against a fresh Postgres DB before the initial production push to establish the Postgres migration baseline.*

## 2. Infrastructure Recommendations

* **Cloud Provider:** Google Cloud SQL for PostgreSQL, AWS RDS PostgreSQL, or equivalent managed service.
* **Instance Sizing:** Minimum 2vCPU / 8GB RAM for pilot workloads.
* **Network:** The database must be deployed in a private VPC subnet. Proofline application servers (or serverless functions) should connect via a VPC Connector or Private IP. No public internet access to the database port (5432).

## 3. High Availability (HA) & Disaster Recovery

* **Multi-AZ:** Production instances must be configured for Multi-AZ (regional) deployment to survive a zone failure.
* **Backups (Daily):** Enable automated daily backups with a retention window of 30 days.
* **Point-in-Time Recovery (PITR):** Enable Write-Ahead Log (WAL) archiving for PITR up to the last 5 minutes.
* **Replication:** For read-heavy API workloads, provision one read replica. Proofline currently relies on the primary for the `Passport` state machine transition locks (optimistic concurrency).

## 4. Maintenance & Upgrades

* Run database engine minor version upgrades during the maintenance window (e.g., Sunday 02:00-04:00 UTC).
* Use `npx prisma db push` only in lower environments. Production schema changes must go through `prisma migrate deploy` triggered via CI/CD.

## 5. Security & Encryption

* **Encryption at Rest:** Ensure the managed database volume is encrypted at rest using a Customer Managed Key (CMK) via GCP KMS or AWS KMS.
* **Encryption in Transit:** Enforce `sslmode=require` in the `DATABASE_URL`.
* **IAM Auth:** Where supported, use IAM-based authentication for the Prisma connection pool rather than static passwords.
