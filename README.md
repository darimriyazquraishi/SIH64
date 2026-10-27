# AICTE Integrated Complaint Monitoring & Coordination Portal
### Smart India Hackathon 2026 | Problem Statement ID: 26264

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-black.svg)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-blue.svg)](https://www.postgresql.org/)
[![Vue](https://img.shields.io/badge/Vue.js-3.5-emerald.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-sky.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Pytest-11%20Passed-brightgreen.svg)]()

---

## 1. Executive Summary & Problem Context

In the governance of higher technical education in India, institution-related complaints are frequently received and processed across disconnected AICTE departments, including:
- **Public Grievance Redressal Cell (PGRC)**: Citizen, student, and faculty grievances regarding unfair practices, fee extortion, and service rules.
- **Approval Bureau (AB)**: Extension of Approval (EoA), land/infrastructure compliance, and sanctioned intake irregularities.
- **Ragging Prevention Cell (RPC)**: Mandatory anti-ragging compliance, helpline referrals, and disciplinary inquiries.
- **Policy & Academic Planning Bureau (PAPB)**: Minimum faculty qualification standards, curriculum compliance, and accreditation discrepancies.
- **Finance & Accounts Bureau (FAB)**: Scholarship grant disbursement and financial audit scrutiny.

When departmental databases are fragmented, authorities struggle to see an institution's **complete regulatory history**, leading to duplicated inquiries, conflicting regulatory actions, and delayed enforcement.

### The Solution
The **AICTE Integrated Complaint Monitoring & Coordination Portal** consolidates cross-departmental records into a single administrative view. Its hallmark capability is an **intelligent, explainable Cross-Bureau Overlap Detection Engine** that correlates complaints concerning the same institution across departments, while strictly preserving departmental autonomy, procedural audit trails, and human-in-the-loop decision authority without destructive auto-merging.

---

## 2. Architecture & Technology Stack

```
                              ┌──────────────────────────────────┐
                              │     Vue 3 + TypeScript SPA       │
                              │ (Tailwind CSS, Pinia, Vue Router)│
                              └─────────────────┬────────────────┘
                                                │ REST API (JSON / Cookies)
                                                ▼
                              ┌──────────────────────────────────┐
                              │       Python Flask REST API      │
                              │ (/api/v1/ Blueprints, Auth, RBAC)│
                              └───────┬──────────────────┬───────┘
                                      │                  │
                SQLAlchemy 2.x ORM    ▼                  ▼  RapidFuzz Matching
                     ┌──────────────────┐      ┌───────────────────────────┐
                     │  PostgreSQL 16   │      │ 4-Stage Overlap Detection │
                     │ Primary Database │      │  (Exact, Fuzzy, Content)  │
                     └──────────────────┘      └───────────────────────────┘
```

### Frontend
- **Framework**: Vue.js 3 (Composition API with `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4 (role-guarded routes)
- **State Management**: Pinia
- **Styling**: Tailwind CSS (Impeccable administrative design discipline: warm/neutral surfaces, ink typography, semantic status indicators)
- **Icons**: Lucide Icons
- **HTTP Client**: Axios with JWT session interceptors

### Backend
- **Framework**: Python 3.11+, Flask 3.1
- **Architecture**: Versioned REST API (`/api/v1/`) structured with modular Flask Blueprints
- **ORM & Data Layer**: SQLAlchemy 2.x
- **Database Migrations**: Flask-Migrate & Alembic
- **Primary Database**: PostgreSQL 16 (psycopg2-binary)
- **Fuzzy Correlation Engine**: RapidFuzz (token set ratio, alias resolution)
- **Automated Testing**: Pytest with automated test database isolation

---

## 3. Repository Structure

```
aicte-complaint-portal/
├── backend/
│   ├── app/
│   │   ├── api/                 # Flask REST API Blueprints
│   │   │   ├── admin.py         # User administration & audit logs
│   │   │   ├── auth.py          # JWT login, logout, session verification
│   │   │   ├── bureaus.py       # AICTE bureaus & cell officers
│   │   │   ├── complaints.py    # Case registration, assignment, transfers
│   │   │   ├── imports.py       # CSV validation preview & commit
│   │   │   ├── institutions.py  # Institution directory & cross-bureau roll-ups
│   │   │   ├── notifications.py # In-app alerts & deadline monitors
│   │   │   ├── overlaps.py      # Cross-bureau overlap review queue
│   │   │   └── reports.py       # Dynamic KPI metrics & CSV export
│   │   ├── models/              # SQLAlchemy relational models
│   │   │   ├── audit_event.py   # Consequential action audit log
│   │   │   ├── bureau.py        # AICTE departments
│   │   │   ├── case_action.py   # Immutable action history
│   │   │   ├── case_link.py     # Unique ordered overlap links
│   │   │   ├── complaint.py     # Case records with overdue calculation
│   │   │   ├── import_batch.py  # Ingestion batch history
│   │   │   ├── institution.py   # Institution profiles & AICTE Permanent ID
│   │   │   ├── notification.py  # Real in-app alerts
│   │   │   └── user.py          # Users with password hashing & RBAC
│   │   └── services/            # Pure business logic layer
│   │       ├── auth_service.py
│   │       ├── complaint_service.py
│   │       ├── import_service.py
│   │       ├── institution_service.py
│   │       ├── notification_service.py
│   │       ├── overlap_service.py  # 4-stage correlation pipeline
│   │       └── report_service.py
│   ├── tests/                   # Automated Pytest suite
│   ├── config.py                # Database and threshold configuration
│   ├── requirements.txt
│   ├── run.py                   # API entry point (port 5000)
│   └── seed.py                  # Reproducible test dataset with Scenarios A-F
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # Axios API client
│   │   ├── components/          # Reusable UI primitives (Badges, Cards, Modals)
│   │   ├── layouts/AppLayout.vue# Administrative application shell
│   │   ├── router/index.ts      # Navigation guards & role restrictions
│   │   ├── stores/              # Pinia state stores
│   │   ├── types/index.ts       # TypeScript domain interfaces
│   │   └── views/               # Complete operational pages
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── scripts/
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 4. Quick Start Guide (Local Development)

### 1-Click Automated Launch (Windows)
Simply double-click [`run.bat`](file:///f:/SIH64/run.bat) in the project root, or execute:
```cmd
run.bat
```
`run.bat` automatically handles the entire lifecycle:
1. **System Check**: Verifies Python (3.11+) and Node.js/npm.
2. **Portable PostgreSQL**: Detects local PostgreSQL; downloads, extracts, and initializes portable PostgreSQL 16 into `SIH64\pgsql` automatically if missing.
3. **Database Readiness**: Starts the local database service, creates databases, and seeds initial records.
4. **Environment & Dependencies**: Creates `backend\.venv`, installs `requirements.txt`, and runs `npm install` if missing.
5. **Orchestrated Startup**: Launches the Flask REST API on `http://localhost:5000` and Vue 3 frontend on `http://localhost:5173`.
6. **Browser Auto-Launch**: Automatically opens `http://localhost:5173` with 1-click credential switchers ready.

To stop all servers and PostgreSQL cleanly, press `[Q]` in the launcher or run [`stop.bat`](file:///f:/SIH64/stop.bat).

---

### Manual Setup Workflow

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 14+ running locally on port 5432

### Step 1: Clone and Configure Environment
```bash
git clone <repo-url>
cd aicte-complaint-portal
cp .env.example .env
```

### Step 2: Set up Backend & Database
```bash
cd backend
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt

# Run the reproducible seed command (creates tables & scenario records):
python seed.py

# Start the Flask API server (runs on http://127.0.0.1:5000):
python run.py
```

### Step 3: Set up & Start Frontend
In a new terminal:
```bash
cd frontend
npm install

# Start Vite development server (runs on http://127.0.0.1:5173):
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## 5. Docker Compose Workflow (Optional Convenience)

To launch the entire stack (PostgreSQL + Flask + Vue) with one command:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

---

## 6. Official Demonstration Credentials & 3 Distinct Roles

The portal supports three distinct login roles, each with its dedicated dashboard, workflows, and backend-enforced authorization:

| Role | Quick Demo Login | Official Email Login | Password | Designated Dashboard & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `admin` | `admin@aicte.gov.in` | `admin` / `Admin@12345` | Global oversight, system analytics, user management, SLA configuration, audit logs |
| **AICTE Bureau Official** | `industry` | `officer.pgrc@aicte.gov.in` | `industry` / `Officer@12345` | Assigned cases, bureau management, overlap verification side-by-side, coordination notes, transfers |
| **Public Complainant** | `user` | `student@example.com` | `user` / `User@12345` | File complaint, track ticket, respond to inquiries without new complaint, printable acknowledgement |

*Tip: The login page includes 1-click quick-fill role buttons (`System Administrator`, `Bureau Official`, `Public Complainant`) for instantaneous testing.*

---

## 7. Role-Wise Feature Walkthrough

### Role 1: Public User / Complainant Dashboard (`/user`)
- **File a New Complaint (`/register`)**: Select AICTE approved institution (with AICTE Permanent ID), specify category, describe grievance, attach supporting evidence.
- **Track Existing Complaints (`/track`)**: Real-time status lookup using Complaint Number / Ticket ID, showing current status, responsible Bureau/Cell, submission date, and latest public update.
- **Additional Information Requests (`/respond`)**: Complainants can directly submit clarifications and upload missing documents in response to an official inquiry **WITHOUT filing a new complaint**.
- **Downloadable Acknowledgement and Status Summary**: One-click printable formal acknowledgement slip with Government of India and AICTE letterhead, verification seal, and current status summary.
- **Complaint History**: Consolidated list of all complaints lodged by the user with their recorded outcomes.
- **Backend-Enforced Privacy & Isolation**: Complainants strictly see **ONLY** their own complaints. Internal Bureau remarks, sensitive investigative notes, and other citizens' records are completely blocked at the API level (HTTP 403).

### Role 2: AICTE Bureau Official Dashboard (`/complaints`)
- **My Assigned Cases**: Fast filter for cases assigned to the logged-in officer, displaying priority, status, deadline, and next action required.
- **Bureau-Wide Case Management & Reassignment**: View all complaints within the officer's Bureau jurisdiction, inspect caseworker allocation, and reassign cases to authorized caseworkers with custom instructions.
- **Overlap Detection and Verification**: Side-by-side comparison drawer showing AICTE Permanent IDs, complaint descriptions, and action histories. Officer selects one of three exact canonical decisions:
  1. **Confirmed Overlap** (establishes mutual case links, dispatches dual bureau notifications, and records coordination action)
  2. **False Alert** (records dismissal rationale)
  3. **Needs Review** (flags for supervisory inspection)
- **Institution-Wise Case Timeline / 360° Profile (`/institutions`)**: Search by AICTE Permanent ID to inspect all cross-bureau complaints, historical actions, and regulatory sanctions in one unified timeline.
- **Deadline and Overdue Alerts**: Real-time identification of cases nearing statutory SLA deadlines and overdue alerts with visual indicators.
- **Case Ageing Indicator**: Displays pending duration in days (`X days pending`) to monitor stalled matters.
- **Next Action Tracking**: Dedicated modal and audit trail to schedule the next procedural requirement and identify the responsible officer.
- **Transfer Bureau Jurisdiction**: Formal hand-off to another AICTE Bureau with mandatory rationale, preserving the original complaint ID, history, and ownership.
- **Inter-Bureau Coordination Notes**: Document agreed decisions between bureaus to prevent conflicting directives.
- **Related Case Linking**: Cross-reference related complaints while keeping individual IDs, owners, and histories intact (**never auto-merging**).
- **Advanced Search & Filters**: Filter by status, priority, bureau, ageing, and keyword.

### Role 3: System Administrator Dashboard (`/admin` & `/reports`)
- **System-Wide Analytics**: High-level metrics for received, under-process, disposed, transferred, and overdue cases with Bureau-wise and region-wise breakdowns.
- **Institution and Case Overview**: Search cross-institution records with AICTE Permanent IDs.
- **User and Role Management**: Create new accounts, assign officers to Bureaus, toggle active status, and manage designations.
- **Deadline & Escalation Configuration**: Configure statutory SLA days per priority level (`Critical`, `High`, `Medium`, `Low`).
- **Reports and CSV Export (`/reports`)**: Generate monthly and quarterly reports on disposal rates, ageing, bureau workloads, and recurring complaints; export clean CSV data with one click.
- **Audit Logs & System Health**: Immutable audit trail of status changes, assignments, transfers, and overlap reviews, with live PostgreSQL health checks.
- **Data Import & Validation**: CSV ingestion wizard that detects missing AICTE Permanent IDs, invalid categories, and duplicate records prior to committing.
- **Configurable Categories & Bureaus**: Add or edit complaint categories and Bureaus dynamically without code modifications.

---

## 8. Multi-Stage Overlap Detection Pipeline

The signature capability operates in 4 transparent, auditable stages:

1. **Stage A — Exact Identifier Matching**:
   - Compares AICTE Permanent IDs (`1-10293847`) and external references (CPGRAMS dockets, High Court writ numbers). Yields high-confidence matches.
2. **Stage B — Institution Identity Resolution**:
   - Normalizes institutional names by stripping punctuation and expanding standard Indian educational abbreviations (`Inst.` → `Institute`, `Tech.` → `Technology`, `Engg.` → `Engineering`).
   - Computes token set ratio and alias cross-matching via RapidFuzz, penalized if institutions reside in different states.
3. **Stage C — Content & Topic Similarity**:
   - Matches regulatory categories (`Fee Overcharging`, `Ragging`, `Approval Fraud`).
   - Extracts salient keywords using domain-specific stopword filtering and calculates Jaccard token overlap alongside token sort ratios.
4. **Stage D — Explainable Synthesis & Human Review**:
   - Synthesizes an overall weighted score ($0.0$ to $1.0$).
   - Generates an explainable human-readable rationale (e.g., *"Identical AICTE ID; 85% keyword overlap regarding capitation fee; cross-departmental case between PGRC and AB"*).
   - Enforces unique canonical ordered indexing `(id_a < id_b)` to prevent duplicate links.

---

## 9. Automated Testing & Verification

The backend test suite runs against an isolated PostgreSQL test database:

```bash
cd backend
pytest -v
```

### Verified Test Results (11 Passed):
- `tests/test_auth.py`: Token login, invalid credentials rejection, `/api/v1/auth/me`, 401 unauthorized checks.
- `tests/test_complaints.py`: Case registration, status updates, auditable action history timeline, and 403 bureau boundary restrictions.
- `tests/test_overlap.py`: Normalization pipeline, keyword extraction, automated cross-bureau overlap detection, and official review decisions.
- `tests/test_import.py`: CSV preview validation, row error reporting, and batch commit transactions.

### Frontend Production Build:
```bash
cd frontend
npm run build
```
- Compiles with Vue TypeScript compiler (`vue-tsc -b`) and Vite production bundler in under 2 seconds with **0 errors**.

---

## 10. Security & Privacy Highlights

- **Role-Based Access Control**: Strict backend verification on every endpoint; frontend controls are backed by server-side authorization.
- **Password Security**: Passwords hashed using `werkzeug.security` (PBKDF2-SHA256 with dynamic salt).
- **Session Protection**: JWT authentication supported via `Authorization: Bearer <token>` and `HttpOnly`, `SameSite=Lax` cookies.
- **Audit Trails**: Consequential regulatory actions (logins, status updates, assignments, transfers, overlap decisions, CSV imports) record immutable `AuditEvent` records with user ID, IP address, and payload snapshots.
- **Data Integrity**: Parameterized ORM queries prevent SQL injection; canonical ordered link constraints prevent duplicate relationship links.

---

## 11. Official SIH 2026 Compliance

This software has been developed exclusively to address **Problem Statement 26264**:
- Internal administrative intelligence portal (not a generic public intake form).
- Solves cross-departmental silos between AICTE Bureaus.
- 100% locally runnable using free and open-source tooling without paid external AI APIs or cloud dependencies.
