# Enterprise Compliance and Deployment

This document covers enterprise readiness, deployment strategies, and SOC2 compliance mapping for Proofline.

## 22. Private/Dedicated Deployment Runbooks

For enterprise customers requiring isolated environments (VPC peering or dedicated clusters):
- **Infrastructure as Code**: Terraform modules are available under `infra/terraform/enterprise`.
- **Database**: We provision dedicated PostgreSQL (Cloud SQL/RDS) instances with forced SSL and IAM authentication.
- **Compute**: Next.js applications and worker nodes run in isolated Kubernetes namespaces or dedicated EC2/GCE instance groups.
- **Runbook**: See `docs/runbooks/enterprise-provisioning.md` for the step-by-step cluster creation.

## 23. Data Residency Options

Proofline supports multi-region deployments to comply with GDPR, CCPA, and regional mandates:
- **US Region**: Data resides entirely in `us-east-1` / `us-central1`.
- **EU Region**: Data resides entirely in `eu-central-1` / `europe-west1`.
- **Tenant Routing**: Requests are routed to the regional endpoint based on the `x-tenant-id` prefix.
- Evidence artifacts never cross regional boundaries.

## 27. SLA Monitoring, Status Page, Incident Process

- **Monitoring**: Datadog is configured to monitor HTTP 500 rates, latency (p95), and worker queue depth.
- **SLA**: 99.9% uptime SLA for enterprise plans.
- **Status Page**: Public status page available (powered by Statuspage.io).
- **Incident Response**: Managed via PagerDuty. See `docs/runbooks/incident-response.md`.

## 28. Pen-test / Continuous Security Scanning

- **DAST / SAST**: Integrated in GitHub Actions using CodeQL and OWASP ZAP.
- **Dependency Scanning**: Dependabot and Snyk run daily.
- **Annual Pen-Test**: Third-party penetration tests are conducted annually. Reports are available to Enterprise customers under NDA.

## 30. SOC2 Control Mapping

| Trust Service Criteria (TSC) | Control Implementation in Proofline |
|------------------------------|-------------------------------------|
| **CC6.1 (Logical Access)**   | SCIM and NextAuth SAML/OIDC SSO integration. RBAC enforced on all API routes via `x-tenant-id` scoping. |
| **CC8.1 (Change Management)**| Proofline itself uses Proofline! All PRs require a green Passport, CI checks, and approved human review. |
| **CC7.2 (Security Events)**  | Structured logging with context IDs. AuditEvents are persisted immutably in PostgreSQL and exported to SIEM. |
| **CC6.6 (Encryption)**       | Evidence at rest encrypted via CMK (KMS). TLS 1.3 enforced for data in transit. |
