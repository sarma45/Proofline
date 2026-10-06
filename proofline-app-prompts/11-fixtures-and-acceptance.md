# 11 — Fixtures & Acceptance

Each fixture must assert:

- Expected passport **state**
- Expected **API** response shape/codes
- Expected **evidence** artifact(s)
- Expected **audit** event(s)
- Expected **user-visible** message
- Whether integration is **blocked**

## Required scenarios (from product spec)

1. Clean AI-assisted feature with complete evidence → path to VERIFIED_FOR_SCOPE (with human if required)
2. Passing tests but missing behavioral coverage → unknowns / Test Adequacy gaps
3. Unplanned file change → scope drift finding
4. Stale reviewed commit → EXPIRED; re-verify works
5. New dependency not in lockfile → dependency check fail/block
6. Secret introduced in diff → BLOCKED / critical finding
7. Prompt injection in repository README → quarantined / finding; no tool grant
8. Malicious or forbidden skill request → fail closed
9. Provider timeout and retry → partial evidence or retryable path; no false pass
10. Duplicate webhook delivery → single side effect
11. Worker lease loss and stale completion → no duplicate usage/comments
12. Pull-request update after passport generation → expire or stale banner + re-verify
13. Critical security finding → cannot VERIFIED_FOR_SCOPE until disposition
14. Accessibility regression → finding on changed UI
15. Visual regression → when fixtures exist
16. Cross-tenant access attempt → 403; audit
17. Evidence retention and deletion → retention worker honors policy
18. Unknown external submission result → remains unknown; not auto-passed

## Launch gates (do not public-launch until)

- [ ] Primary PR flow works end to end
- [ ] Passport JSON schema versioned
- [ ] GitHub signatures and retries tested
- [ ] Tenant isolation passes
- [ ] Tool scope cannot be bypassed
- [ ] Secret redaction passes
- [ ] Prompt-injection fixtures quarantined
- [ ] Worker fencing passes
- [ ] DB migrations pass from empty and previous versions
- [ ] Accessibility checks pass on UI
- [ ] Security fixtures triaged
- [ ] Billing usage events reconcile with passports
- [ ] Docs enable a new developer to run without hidden steps

## Definition of done (product)

A new developer can:

1. Start the system locally
2. Install the GitHub integration in a test repository
3. Open a pull request
4. Run Proofline
5. View a Change Passport
6. Trace a finding to evidence
7. Approve or block the change
8. Export the passport
9. Re-run verification after a commit update
10. Reproduce results from documented fixtures
