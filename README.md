# Proofline

**The Evidence OS for AI-built software.**

Proofline is a next-generation CI/CD and compliance platform designed specifically to evaluate, audit, and provide cryptographically secure assurance for code written by autonomous AI agents. 

It intercepts Pull Requests, runs extensive verification tasks, and enforces policies via a rigid State Machine to guarantee that changes are safe, within scope, and fully documented before they ever touch production.

## Features

- **State Machine Authority**: A strict, event-driven state machine governs the entire lifecycle of a change (from `EVIDENCE_COLLECTING` to `VERIFIED_FOR_SCOPE` or `HUMAN_REVIEW_REQUIRED`).
- **Tenant Isolation**: Secure, multi-tenant architecture designed to scale.
- **Asynchronous Workers**: Polling-based background daemon for asynchronous execution and webhook delivery.
- **Evidence UI**: A rich Next.js dashboard providing deep insights into why a change was approved or blocked.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (via Prisma ORM)
- **Styling**: Tailwind CSS
- **Testing**: Vitest

## Getting Started

### GitHub sign-in and installation

Configure a GitHub App and Vercel using the checklist in [`docs/github-auth-setup.md`](docs/github-auth-setup.md). Sign-in requires the GitHub App's **Client ID** and matching **Client Secret**, `NEXTAUTH_SECRET`, and the exact callback URL `https://YOUR-HOST/api/auth/callback/github`. GitHub App installation and the webhook are separate from OAuth sign-in; the current webhook endpoint is an MVP stub and does not yet process repository events.

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database and run migrations:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Seed the database with the mock tenant and initial data:
   ```bash
   npm run tsx prisma/seed.ts
   ```

### Running Locally

To start the Next.js development server:
```bash
npm run dev
```

To start the background worker daemon (processes Verification Runs and Outbox events):
```bash
npm run worker
```

## Testing

Proofline uses `vitest` for unit testing. The test suite covers API route contracts, tenant isolation, outbox retries, and the core State Machine.

To run the test suite:
```bash
npm run test
```

## End-to-End Simulation

You can simulate the entire GitHub Webhook lifecycle locally without needing a live GitHub App connection. The simulation script intercepts a mock PR event, triggers the engine worker, processes the outbox, and transitions the state machine.

Run one of the following scenarios:

**1. The Clean Path** (Passes all checks seamlessly)
```bash
npm run e2e clean
```

**2. The Human Review Path** (Generates warnings, requires human approval)
```bash
npm run e2e human
```

**3. The Blocked Path** (Critical failures, merge blocked)
```bash
npm run e2e blocked
```

After running a simulation, the script will output a local UI link where you can inspect the generated Passport and its evidence.
