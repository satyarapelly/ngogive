# Codex Master Task: Automate Give For Society PANKHUDI Anganwadi Project Execution

## 1. Objective

Extend the existing Give For Society NGO website with a secure, production-ready PANKHUDI Anganwadi Project Execution System for Kumuram Bheem Asifabad.

The system must replace spreadsheet-only operations for:

- project and centre master data;
- categories, sub-categories, line items, quantities, and approved scope;
- cost-library rates and detailed project estimates;
- project selection, batch planning, assignment, scheduling, and weekly capacity;
- RFQ, quotation comparison, vendor selection, purchase orders, delivery, installation, and acceptance;
- expense, vendor-invoice, payment, bank-facility, drawdown, claim, receipt, and repayment tracking;
- evidence requirements generated from the selected project line items;
- PANKHUDI status mirroring without scraping the portal;
- document generation and a complete downloadable project dossier;
- management, bank, CSR/funder, procurement, finance, and M&E dashboards.

The current source portfolio contains approximately 250 projects and 1,134 line-item records. Treat these as expected reconciliation counts, not permanent hard-coded limits.

## 2. Source files

Create an import directory and support these files when present:

```text
docs/source-data/
├── KumuramBheem_Anganwadi_Projects.xlsx
├── KumuramBheem_Anganwadi_50K_Itemwise_Implementation_Plan.xlsx
└── Give_For_Society_PANKHUDI_25L_Minor_Medium_Bank_Annexure.xlsx
```

If the repository already stores these elsewhere, reuse that location and document it.

The importer must:

1. inspect sheet names and headers;
2. map columns using a configurable alias map;
3. preview changes before commit;
4. validate required identifiers and data types;
5. report new, updated, skipped, conflicting, and invalid rows;
6. import transactionally;
7. be idempotent;
8. store the source file hash, import time, user, and row-level provenance;
9. never overwrite approved records without an explicit versioned change request.

Expected source concepts include:

- Projects;
- Activities / Line Items;
- Impacts / beneficiaries;
- Project Implementation Plan;
- Item-wise allocation;
- Cost and Scope Library;
- Category Playbook;
- Phase Execution Plan;
- Procurement and Evidence;
- Data Quality / Scope Gaps;
- Bank Executive Summary;
- Minor and Medium Project annexures.

Build a reusable import mapping screen and a command-line import command.

## 3. Stack and integration rule

### 3.1 Existing repository

First inspect the repository and write `docs/pankhudi/REPOSITORY_ASSESSMENT.md` describing:

- current frontend framework;
- backend/API architecture;
- authentication;
- database and ORM;
- file storage;
- email/SMS capability;
- testing tools;
- deployment pipeline;
- design system;
- risks and integration approach.

Integrate into the existing application. Prefer routes similar to:

```text
/admin/pankhudi
/field/pankhudi
/finance/pankhudi
/procurement/pankhudi
/reports/pankhudi
```

Do not break public NGO pages.

### 3.2 Greenfield fallback

Only if the current site cannot support authenticated application workflows, create a maintainable TypeScript web application using the repository's preferred package manager. The fallback may use:

- a modern React/Next.js application;
- PostgreSQL;
- Prisma or the repository's standard ORM;
- object storage compatible with S3;
- background jobs for document generation and imports;
- a PWA/mobile-first field experience.

Do not hard-code package versions in this specification. Choose stable versions compatible with the repository.

## 4. Roles and permissions

Implement configurable RBAC with at least:

1. Super Admin
2. Founder / President
3. Project Director
4. Programme Manager
5. Procurement Officer
6. Procurement Approver
7. Finance Officer
8. Finance Approver
9. Field Coordinator
10. Field Officer
11. M&E / Evidence Reviewer
12. Auditor / Read-only
13. Bank / Funder Read-only portal user, optional and disabled by default
14. Vendor portal user, optional and disabled by default

Rules:

- A user cannot approve a transaction they initiated.
- Procurement and payment approval thresholds are configurable.
- Sensitive financial exports require an authorised role.
- Evidence can be replaced only through a versioned action with an audit reason.
- Project completion requires an independent reviewer.
- Every permission check must be enforced server-side.

## 5. Core data model

Design normalized, migration-backed tables/entities for at least:

### Organisation and people
- Organisation
- User
- Role
- Permission
- Team
- TeamMember
- UserDistrict / UserMandal access scope

### Geography and centres
- District
- Mandal
- Village
- AnganwadiCentre
- CentreContact
- CentreBaseline
- CentreAsset
- CentreVerification

### Project master
- Project
- ProjectExternalReference
- ProjectCentre
- Category
- SubCategory
- LineItemDefinition
- ProjectLineItem
- ProjectImpact
- ProjectDependency
- ProjectRisk
- ProjectStatusHistory
- ProjectTag

### Planning
- CostLibraryItem
- CostLibraryRateVersion
- ScopeTemplate
- Estimate
- EstimateVersion
- EstimateLine
- BoQ
- BoQLine
- ProjectBatch
- BatchProject
- Assignment
- Task
- Milestone
- TeamCapacityRule
- WeeklyPlan
- RouteCluster

### Procurement
- Vendor
- VendorDocument
- VendorBankAccount
- RFQ
- RFQLine
- RFQInvitation
- Quotation
- QuotationLine
- ComparativeStatement
- VendorSelectionApproval
- PurchaseOrder
- PurchaseOrderLine
- DeliveryChallan
- GoodsReceiptNote
- GoodsReceiptLine
- Installation
- Commissioning
- AssetRegister
- Warranty
- Defect
- Retention

### Finance
- FundingSource
- FundingCommitment
- BankFacility
- BankFacilityTranche
- Drawdown
- ProjectFundingAllocation
- VendorInvoice
- VendorInvoiceLine
- PaymentRequest
- PaymentApproval
- Payment
- Expense
- Claim
- ClaimLine
- Receipt
- Repayment
- InterestCharge
- BankCharge
- LedgerEntry
- BudgetVariance

### Evidence and documents
- EvidenceRule
- EvidenceRequirement
- EvidenceArtifact
- EvidenceReview
- EvidenceChecklist
- DocumentTemplate
- GeneratedDocument
- CompletionCertificate
- UtilisationCertificate
- Handover
- PortalSubmission
- PortalStatusSnapshot
- AuditLog
- Notification
- Comment

Use immutable external IDs and internal UUIDs. Use exact decimals or integer paise for money.

## 6. Project status workflow

Implement a configurable state machine. Seed the following lifecycle:

```text
Imported
→ Needs Validation
→ Validated
→ Ready for Planning
→ Scope Frozen
→ Estimate Approved
→ RFQ In Progress
→ Vendor Selected
→ PO Issued
→ Scheduled
→ In Execution
→ Delivered
→ Installed / Work Completed
→ Evidence Pending
→ Evidence Under Review
→ Ready for PANKHUDI Submission
→ Submitted to PANKHUDI
→ Under Review
→ Completion Confirmed
→ Claim Submitted
→ Funding Received
→ Bank Repaid
→ Closed
```

Additional statuses:

```text
On Hold
Cancelled
Scope Revision Required
Funding / Convergence Required
Defect Rectification
Partially Completed
```

Transitions must have:

- permission rules;
- required documents/evidence;
- timestamp;
- actor;
- reason;
- optional approval;
- audit log.

Do not allow direct jumps that bypass approvals.

## 7. Complexity, readiness, and bank-scope rules

Seed classifications:

- Minor
- Medium
- Complex

Seed readiness:

- Ready for bank-funded execution
- Conditional — freeze reduced scope/BoQ first
- Hold — convergence or data correction required

The present bank facility is:

- Borrower: Give For Society
- Programme: PANKHUDI Anganwadi projects, Kumuram Bheem Asifabad
- Facility request: ₹25,00,000
- Tranche 1: up to ₹8,00,000 for minor projects
- Tranche 2: up to ₹17,00,000 for medium projects
- Selected scope: 33 minor + 37 medium projects
- Complex/civil-heavy projects excluded from this facility unless separately approved.

Create a configurable rule engine so bank facility eligibility is based on:

- complexity;
- readiness;
- selected line items;
- approved estimate;
- funding source;
- evidence readiness;
- technical approval;
- project status;
- available undrawn facility.

## 8. Cost library and estimating

Create a versioned cost library with:

- item name;
- category and sub-category;
- unit;
- standard specification;
- low, planning, and high rate;
- installation component;
- freight component;
- taxes;
- contingency;
- warranty / AMC;
- source;
- quote date;
- geography;
- validity period;
- approval status.

### Water purifier approved planning package

Seed or import the current approved planning provision:

- 30 RO/UV/UF packages
- total planning provision: ₹6,81,000
- average planning provision: ₹22,700 per centre.

Package may include:

- purifier technology selected after site validation;
- pre-filter;
- plumbing pipes, taps, valves, connectors;
- mounting/stand;
- transport;
- installation;
- commissioning;
- initial filters;
- warranty;
- centre handover and documentation.

Do not replace this with the earlier low-cost gravity-filter estimate.

### Estimate engine

For selected projects:

1. select or confirm line items and quantities;
2. choose a cost-library rate version;
3. calculate base, installation, freight, tax, contingency, and total;
4. compare against project ceiling and funding availability;
5. mark full, partial, deferred, or convergence-required;
6. prevent partial spending that cannot create a complete usable output;
7. support revisions with approval and change reason;
8. show project, batch, category, bank-facility, and vendor views;
9. generate a detailed estimate and BoQ.

All totals must be formula-based and independently recalculated on the server.

## 9. Procurement workflow

Implement:

1. procurement requisition from approved estimate/BoQ;
2. project and line-item selection;
3. RFQ generation;
4. invitation to at least three vendors or a documented exception;
5. quotation upload and structured entry;
6. technical compliance review;
7. commercial comparison;
8. landed-cost calculation;
9. vendor selection and approval;
10. PO generation;
11. advance request where approved;
12. delivery and GRN;
13. installation / commissioning;
14. defect and retention management;
15. final payment approval.

Provide a comparative statement with:

- quoted unit price;
- GST;
- freight;
- installation;
- warranty;
- delivery time;
- service coverage;
- technical compliance;
- deviations;
- landed cost;
- ranking;
- selection reason.

Add duplicate-invoice detection by vendor + invoice number + amount + date.

## 10. Evidence standards engine

Evidence requirements must be generated automatically from the selected project line items and project type.

### 10.1 Universal mandatory evidence

Seed these universal requirements:

1. PANKHUDI project record / external reference
2. Project UID and Project ID
3. centre verification form
4. baseline photos
5. approved scope and BoQ
6. quotations
7. comparative statement / selection approval
8. purchase order or work order
9. vendor invoice uploaded and verified
10. payment proof
11. delivery challan and GRN
12. before, during, and after photos as applicable
13. geolocation and timestamp where device permission is available
14. beneficiary-centre acknowledgement
15. completion / commissioning certificate
16. warranty or asset record
17. PANKHUDI submission acknowledgement
18. CSR/funder claim submission
19. utilisation certificate when required
20. funding receipt and bank repayment record when financed.

### 10.2 Water purifier requirements

Generate additionally:

- water-source and TDS/site assessment;
- selected RO/UV/UF specification;
- inlet, outlet, electricity, drainage, and mounting readiness;
- unit serial number;
- filter and storage capacity;
- pre-filter details;
- installation checklist;
- commissioning / water-flow test;
- warranty card;
- service-contact details;
- user demonstration acknowledgement;
- first-service due date.

### 10.3 Solar/electrical requirements

Generate additionally:

- load survey;
- capacity calculation;
- roof/site safety;
- panel/inverter/battery serials;
- earthing and protection checklist;
- installation diagram;
- electrical test report;
- warranty;
- commissioning record.

### 10.4 Civil/repair requirements

Generate additionally:

- ownership/NOC where required;
- site measurements;
- drawing/sketch;
- engineer estimate;
- technical sanction;
- work order;
- measurement book;
- milestone photos;
- material-test records if applicable;
- engineer completion certificate.

Complex projects remain outside the current ₹25 lakh bank facility by default.

### Completion gate

A project must not enter `Completion Confirmed` unless:

- every hard-blocker evidence requirement is approved;
- financials reconcile;
- open defects are closed or formally accepted;
- the centre has acknowledged handover;
- the project reviewer approves completion.

Display an evidence-completeness score, but use explicit blockers rather than only a percentage.

## 11. PANKHUDI status mirror

Create `PankhudiConnector` with methods such as:

```ts
interface PankhudiConnector {
  getExternalLink(projectId: string): Promise<string | null>;
  importStatus(file: UploadedFile): Promise<ImportResult>;
  updateManualStatus(input: ManualPortalStatusInput): Promise<PortalStatusSnapshot>;
  syncViaOfficialApi?(projectIds: string[]): Promise<SyncResult>;
}
```

Current implementation:

- manual status update with evidence;
- CSV/XLSX import;
- project portal link;
- latest status, source, timestamp, and user;
- status-difference report.

Do not implement scraping or login automation. Keep the official API adapter disabled until API documentation, permission, and credentials are supplied.

## 12. Work planning for a 10–12-person team

Implement resource planning for:

- Project Director: 1
- Field / Programme Manager: 1
- Procurement: 1
- Finance: 1
- Field Verification: 2
- Installation / Supervision teams: 4
- Logistics / Store: 1
- Documentation / M&E: 1
- PANKHUDI / CSR liaison: 1, when team size permits.

Seed capacity rules that can be edited:

- purifier / simple asset projects: 10–15 completed projects per week;
- mixed equipment projects: 8–12 per week;
- solar/electrical: 4–6 per week;
- painting/BALA/site-specific medium works: 2–4 per week.

Scheduling must consider:

- mandal and route cluster;
- staff skill;
- vendor availability;
- material availability;
- site readiness;
- project dependencies;
- bank tranche availability;
- evidence-review capacity.

Provide:

- drag-and-drop weekly plan;
- team calendar;
- route cluster;
- workload warnings;
- overdue tasks;
- actual vs planned completion;
- printable daily assignment sheet.

## 13. Field experience

Build a mobile-first PWA or responsive interface for field staff:

- assigned projects;
- centre directions link;
- offline-capable checklist;
- photos;
- geolocation;
- timestamp;
- signature or acknowledgement;
- item serial numbers;
- defects;
- installation status;
- sync queue and conflict handling.

Do not expose unnecessary financial information to field roles.

## 14. Document generation

Generate branded DOCX and PDF documents using Give For Society templates and sequential numbers.

Required templates:

1. Project summary sheet
2. Site verification form
3. Detailed estimate
4. BoQ
5. Procurement requisition
6. RFQ
7. Quotation comparison / comparative statement
8. Vendor selection note
9. Purchase order
10. Work order
11. Delivery challan register
12. GRN
13. Installation / commissioning checklist
14. Asset handover
15. Completion certificate
16. Utilisation certificate
17. Payment voucher
18. Bank drawdown request
19. Bank utilisation statement
20. CSR/funder claim cover note
21. Claim invoice or debit note where legally applicable
22. Receipt
23. Weekly progress report
24. Project dossier index
25. Audit trail export.

### Invoice safety

- Do not generate a vendor GST invoice on a vendor's behalf.
- Vendor invoices are uploaded, indexed, verified, and linked to PO/GRN/payment.
- Generate Give For Society claim invoices, receipts, debit notes, or reimbursement statements only from a configurable template approved by the accountant.
- Require GSTIN, HSN/SAC, place of supply, CGST/SGST/IGST, TDS, and invoice-series settings when applicable.
- Mark draft documents clearly.
- Lock final document numbers and retain all versions.

## 15. Dashboards

### Executive dashboard
- total projects;
- projects by status, complexity, readiness, mandal, category;
- amount approved, estimated, committed, invoiced, paid, claimed, received, repaid;
- bank facility: sanctioned, drawn, spent, claimed, received, repaid, undrawn;
- evidence completeness;
- overdue projects;
- vendor performance;
- weekly capacity and forecast;
- data-quality flags.

### Procurement dashboard
- requisitions;
- open RFQs;
- quotations pending;
- PO pipeline;
- deliveries;
- defects;
- retention;
- vendor concentration;
- rate variance against cost library.

### Finance dashboard
- project budget vs actual;
- invoice aging;
- payment approvals;
- claims;
- receipts;
- bank interest and charges;
- repayment waterfall;
- unreconciled transactions.

### M&E dashboard
- evidence gaps;
- centre-wise completion;
- geotag/photo coverage;
- handover;
- PANKHUDI submission;
- funding status;
- beneficiaries.

Filters and exports must be available.

## 16. Notifications and reminders

Add in-app notifications and email hooks for:

- assignment;
- approval requested;
- quotation deadline;
- delivery due;
- evidence missing;
- warranty due;
- project overdue;
- claim pending;
- funding expected;
- bank interest/repayment due.

Make channels configurable. Do not send real external messages during development.

## 17. Audit, compliance, and security

Implement:

- append-only audit log;
- file-virus/type/size validation;
- private object storage with signed URLs;
- row-level access for geography where needed;
- CSRF/XSS/SQL-injection protections;
- rate limiting;
- secure session management;
- secrets via environment variables;
- backup and restore documentation;
- data retention;
- privacy notice;
- beneficiary PII minimization;
- export log;
- approval log;
- suspicious duplicate and amount-variance alerts.

## 18. Public website integration

Add a public, non-sensitive impact page on the NGO site, behind a feature flag:

- project count;
- centres reached;
- beneficiaries;
- categories;
- completed outputs;
- district/mandal summary;
- approved photographs;
- funder acknowledgements.

Do not display internal budget, bank, beneficiary PII, vendor prices, or unapproved photos.

## 19. APIs and exports

Build authenticated APIs for:

- project CRUD and import;
- line items and cost library;
- estimates/BoQs;
- batches and assignments;
- procurement;
- finance;
- evidence;
- documents;
- portal statuses;
- dashboards;
- exports.

Support:

- CSV/XLSX export;
- PDF/DOCX generation;
- project dossier ZIP;
- bank utilisation package;
- CSR/funder claim package.

Add OpenAPI documentation if the current stack supports it.

## 20. Tests and acceptance criteria

### Import
- Current source imports without duplicate Projects or Project Line Items.
- Expected current reconciliation: approximately 250 projects and 1,134 line items.
- Re-importing the same file changes nothing and reports "no changes."
- Conflicts are shown before commit.

### Costing
- A selected 30-centre RO/UV/UF package produces a planning total of ₹6,81,000 and average ₹22,700.
- Estimate versions preserve prior approved totals.
- Currency calculations are exact.

### Bank facility
- ₹25 lakh facility supports an ₹8 lakh minor tranche and ₹17 lakh medium tranche.
- Complex projects are blocked by default.
- Drawdown cannot exceed approved project allocation or undrawn facility.
- Receipt and repayment transactions reconcile.

### Procurement
- Three-quote workflow or approved exception.
- Initiator cannot approve own vendor selection/payment.
- PO, GRN, vendor invoice, and payment reconcile by quantity and amount.
- Duplicate invoice warning works.

### Evidence
- Evidence requirements are generated by selected line items.
- Water-purifier project cannot complete without site assessment, serial/warranty, installation, commissioning, acknowledgement, and universal evidence.
- Completion is enforced server-side.
- Project dossier ZIP contains an indexed, ordered evidence set.

### PANKHUDI
- Manual and file-import status updates work.
- Every snapshot stores source and timestamp.
- No scraper or credential automation is implemented.

### UI
- Mobile field flow works at common phone widths.
- Keyboard and screen-reader labels exist.
- No broken routes, placeholder actions, or mock data in production paths.

### Quality
- migrations apply cleanly;
- seeds run;
- lint passes;
- typecheck passes;
- unit and integration tests pass;
- critical E2E tests pass;
- security review checklist is complete;
- documentation includes local setup, import, deployment, backup, and operations.

## 21. Implementation phases

Work phase by phase and update `docs/pankhudi/IMPLEMENTATION_STATUS.md`.

### Phase 0 — Audit and plan
- inspect repo;
- create architecture decision record;
- map source workbooks;
- produce implementation plan and risks;
- create Git checkpoint.

### Phase 1 — Foundation and import
- schema;
- migrations;
- RBAC;
- source import;
- reconciliation report;
- project list/detail screens.

### Phase 2 — Planning and costing
- cost library;
- scope;
- estimates;
- BoQ;
- project batches;
- team assignments;
- weekly planning.

### Phase 3 — Procurement
- vendor master;
- RFQ;
- quotation comparison;
- selection;
- PO;
- GRN;
- installation and defects.

### Phase 4 — Evidence and documents
- evidence rules;
- mobile capture;
- approval;
- completion gate;
- DOCX/PDF templates;
- dossier ZIP.

### Phase 5 — Finance and bank
- bank facility;
- drawdowns;
- invoices;
- payments;
- claims;
- receipts;
- interest;
- repayment;
- dashboards and statements.

### Phase 6 — PANKHUDI mirror and public impact
- manual/file status sync;
- link-out;
- difference report;
- public impact page behind feature flag.

### Phase 7 — Hardening
- tests;
- security;
- performance;
- accessibility;
- deployment;
- backup;
- user documentation.

## 22. Required deliverables

At completion provide:

1. working code integrated with the NGO site;
2. database migrations and seed data;
3. idempotent Excel import;
4. all pages, APIs, RBAC, workflows, and reports;
5. DOCX/PDF templates;
6. automated tests;
7. `docs/pankhudi/REPOSITORY_ASSESSMENT.md`;
8. `docs/pankhudi/ARCHITECTURE.md`;
9. `docs/pankhudi/DATA_DICTIONARY.md`;
10. `docs/pankhudi/IMPORT_MAPPING.md`;
11. `docs/pankhudi/OPERATIONS_MANUAL.md`;
12. `docs/pankhudi/USER_GUIDE.md`;
13. `docs/pankhudi/SECURITY_AND_PRIVACY.md`;
14. `docs/pankhudi/DEPLOYMENT.md`;
15. `docs/pankhudi/IMPLEMENTATION_STATUS.md`;
16. sample generated project dossier;
17. test report;
18. list of assumptions and any items requiring owner/accountant/legal confirmation.

## 23. Codex execution instruction

Do not only write a design document. Implement the system.

Before coding:

1. read `AGENTS.md`;
2. inspect the repository and source files;
3. write the assessment and phased plan;
4. create a Git checkpoint.

Then execute the phases in order. Run and fix tests after each phase. Preserve existing site functionality and styling. Do not claim completion unless the acceptance criteria pass. At the end, summarize:

- files changed;
- migrations;
- features completed;
- tests and commands run;
- unresolved risks;
- exact local run and deployment instructions.
