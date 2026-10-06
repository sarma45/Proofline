import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Proofline End-to-End', () => {
  test.beforeAll(async () => {
    // Seed prerequisite models
    await prisma.organization.upsert({
      where: { id: 'e2e-org-1' },
      update: {},
      create: { id: 'e2e-org-1', name: 'E2E Org' }
    });

    await prisma.project.upsert({
      where: { id: 'e2e-project-1' },
      update: {},
      create: { id: 'e2e-project-1', name: 'E2E Project', githubInstallationId: '12345', organizationId: 'e2e-org-1' },
    });

    await prisma.repository.upsert({
      where: { id: 'e2e-repo-1' },
      update: {},
      create: { id: 'e2e-repo-1', fullName: 'e2e/repo', githubRepoId: 'e2e/repo', projectId: 'e2e-project-1' },
    });

    await prisma.pullRequest.upsert({
      where: { id: 'e2e-pr-1' },
      update: {},
      create: { 
        id: 'e2e-pr-1', 
        number: 1, 
        title: 'E2E PR', 
        githubPrId: 'e2e-pr-1',
        repositoryId: 'e2e-repo-1',
        baseCommit: 'base-sha',
        proposedCommit: 'head-sha'
      },
    });

    // Seed a passport for E2E testing
    await prisma.passport.upsert({
      where: { id: 'e2e-passport-1' },
      update: {},
      create: {
        id: 'e2e-passport-1',
        projectId: 'e2e-project-1',
        pullRequestId: 'e2e-pr-1',
        policyVersion: '1.0.0',
        assuranceStatus: 'EVIDENCE_COLLECTING',
        scopeSummary: 'E2E Testing Scope',
      },
    });
  });

  test('W1/W3: View passport page and Evidence Graph', async ({ page }) => {
    // Set tenant header to match seeded project
    await page.setExtraHTTPHeaders({
      'x-tenant-id': 'e2e-project-1'
    });

    await page.goto('/passports/e2e-passport-1');
    
    // Check header
    await expect(page.locator('h1')).toContainText('E2E Testing Scope');
    
    // Check status badge
    await expect(page.getByText('Evidence Collecting')).toBeVisible();

    // Verify Evidence Graph is rendered
    await expect(page.locator('.evidence-graph-container')).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Intent' })).toBeVisible();
  });
});

