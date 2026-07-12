# AGENTS.md — Give For Society PANKHUDI Automation

## Mission
Build and maintain a production-grade project execution, procurement, evidence, finance, and reporting module for Give For Society's PANKHUDI Anganwadi projects in Kumuram Bheem Asifabad.

## Repository-first rule
- Inspect the current repository before changing anything.
- Reuse the existing framework, authentication, design system, database, deployment method, and coding conventions.
- Do not replace the NGO website or create a disconnected application unless the existing site is static or technically cannot support authenticated workflows.
- If a separate admin application is necessary, place it in the existing monorepo and document the integration path.

## Data integrity
- Project UID and Project ID are immutable external identifiers.
- Imports must be idempotent and produce an import report.
- Never silently overwrite approved budgets, estimates, purchase orders, invoices, payments, or evidence.
- Use versioning for estimates, BoQs, cost-library rates, and document templates.
- Store money in integer paise or an exact decimal type; never use floating point for currency.
- Store dates and timestamps in UTC and display in Asia/Kolkata.

## PANKHUDI integration boundary
- Do not scrape, bypass authentication, or automate logins on the government portal.
- Implement a connector interface with:
  1. manual status update,
  2. CSV/XLSX status import,
  3. external project link,
  4. an API adapter that remains disabled until official API documentation and credentials are provided.
- Label portal status as "reported/synced" and preserve the source and timestamp.

## Financial and invoice safety
- The application may generate estimates, BoQs, RFQs, comparative statements, purchase orders, goods-receipt notes, payment vouchers, utilisation statements, donor/CSR claim invoices, and receipts where legally appropriate.
- Do not fabricate vendor GST invoices. Vendor invoices are uploaded and verified.
- GST, TDS, HSN/SAC, bank interest, and eligible-cost treatment must be configurable and reviewed by the NGO's accountant.
- An initiator may not approve their own procurement or payment.

## Completion gate
A project cannot become Completed until every mandatory evidence requirement for its selected line items is uploaded, approved, and linked to the project. Hard blockers must be enforced server-side, not only in the UI.

## Security
- Use role-based access control and least privilege.
- Encrypt secrets and use signed private file URLs.
- Keep an immutable audit log for approvals, status changes, financial changes, document generation, and evidence deletion/replacement.
- Validate uploaded file types and sizes.
- Do not expose beneficiary personal data publicly.
- Use soft delete for business records and retention policies for evidence.

## Quality requirements
- Add database migrations, seed data, automated tests, and developer documentation.
- Run linting, type checks, unit tests, integration tests, and end-to-end tests before finishing.
- Keep UI mobile-first for field staff.
- Use accessible labels, keyboard navigation, and clear validation errors.
- Do not leave placeholder buttons, dead routes, or mock data in production paths.

## Delivery discipline
- Work in small phases.
- Create a Git checkpoint before implementation and after each major phase.
- Maintain `docs/pankhudi/IMPLEMENTATION_STATUS.md` with completed work, commands run, test results, unresolved risks, and the next step.
- If an assumption is required, document it in `docs/pankhudi/ASSUMPTIONS.md` instead of hiding it in code.
