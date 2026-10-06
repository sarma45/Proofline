# Planned GitHub Issues

The following issues are derived from the enterprise and 3D roadmap, specifically the tasks that remain for future product expansion, design spikes, or are awaiting product-led decisions.

### [P0] Epic: Enterprise SSO & Tenant Boundary Solidification
* **Description:** Implement SAML/OIDC for the pilot customer. While automated tests prove the schema boundaries work (`projectId`), we need to connect `next-auth` to Okta/AzureAD and map email domains to tenants during login.
* **Labels:** `enterprise`, `auth`, `p0`

### [P1] Epic: 3D Marketing Layer Phase C & D
* **Description:** The foundation (`viz-3d` package structure, feature flags, and fallback SVG UI) has been built. We need to implement the actual WebGL node geometries, particle animations for the transition effects, and optimize memory usage for the seal component.
* **Labels:** `marketing`, `frontend`, `p1`, `3d`

### [P1] Epic: Audit Export UI
* **Description:** We have `AuditEvent` tracking every state machine transition perfectly. We need to build a UI on the Dashboard allowing compliance officers to download these logs as signed CSV/JSON for SOC2 evidence.
* **Labels:** `enterprise`, `compliance`, `p1`

### [P2] Spike: Customer Managed Keys (CMK)
* **Description:** The `EvidenceArtifact` schema currently supports a `kmsKeyId`. We need to spike the actual API integration with GCP KMS / AWS KMS to encrypt/decrypt blobs dynamically for BYOK (Bring Your Own Key) tenants.
* **Labels:** `security`, `enterprise`, `p2`

### [P2] Feature: Webhook Dashboard
* **Description:** Proofline currently handles GitHub webhooks silently via the `GithubWebhookDelivery` table. Create an admin dashboard to view webhook delivery successes/failures and manually retry dropped payloads.
* **Labels:** `ops`, `p2`
