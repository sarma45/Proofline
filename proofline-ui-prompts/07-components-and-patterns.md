# 07 — Components & Patterns

Build a small, consistent set. Prefer composition over many one-off variants.

## Core components

### StatusPill
- Props: status (assurance enum), size
- Always: icon + text
- Tooltip or aria description for full meaning

### SeverityBadge
- critical / high / medium / low / info
- Shape + text, not color alone

### HashDisplay
- Short form + copy button
- Optional “match / mismatch” when comparing two hashes
- Mono font

### CommitRange
- base → proposed, both short SHAs, links to GitHub

### SectionHeader
- Title, optional count, optional anchor id
- No decorative icon tile required

### EvidenceChip / EvidenceRef
- Links to artifact; shows type and short label
- Opens side panel or external evidence URL

### FindingRow
- Severity, title, check type, “view evidence”
- Expandable for details and limitations

### CheckResultCard or CheckResultRow
- status, summary, limitations, evidence_refs
- Failed and unknown stay visually distinct from passed

### DataTable (files, symbols, dependencies)
- Sortable / filterable where useful
- Compact rows; mono for paths
- Badge for “unplanned”

### AlignmentMatrix
- The plan-vs-actual yes/no table from section 4
- Clear positive / negative / unknown cells

### EvidenceGraph
- Accessible structure (list or tree) + optional visual graph
- Node click → scroll or detail panel

### DecisionForm
- Radio or button group: Approve / Request changes / Block / Escalate
- Rationale textarea
- Submit + confirmation

### StickyPassportHeader
- Condensed decision header for scroll state

### Banner
- Variants: stale passport, partial evidence, provider unavailable, permission denied, expired
- Always include next action

### EmptyState
- Illustration optional and restrained
- Primary action + secondary learn more

### Progress / Completeness
- “7 of 9 required checks complete” — not a fake overall score
- Segmented or simple fraction

## Patterns

### Progressive disclosure
- Audit details collapsed
- Long file lists “show all”
- Graph details on demand

### Side panel
- Evidence detail, finding detail, without leaving passport context

### Inline copy
- Every SHA, hash, request ID

### Filters
- Passport list and change map: status, planned/unplanned, severity

### Confirmations
- Block and irreversible decisions may need confirm; approve can be lighter per policy

## Do not build

- Chat transcript UI as the primary review surface
- Infinite agent log dumps as the main content
- Decorative dashboard widgets that do not aid the decision
