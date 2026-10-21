import os
import sys
from datetime import datetime, timezone, timedelta

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.models import db, Bureau, User, Institution, Complaint, CaseAction, CaseLink, Notification, AuditEvent
from app.services.overlap_service import scan_complaint_overlaps

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating tables in PostgreSQL...")
        db.create_all()

        # Check if already seeded
        if db.session.query(User).filter_by(email="admin@aicte.gov.in").first():
            print("Database already contains seed data. Skipping seed.")
            return

        print("Seeding AICTE Bureaus and Cells...")
        bureaus = [
            Bureau(
                name="Public Grievance Redressal Cell",
                code="PGRC",
                description="Handles citizen, student, and faculty grievances regarding unfair practices, unauthorized fees, and service rules."
            ),
            Bureau(
                name="Approval Bureau",
                code="AB",
                description="Governs regulatory approvals, extension of approvals (EoA), land/infrastructure compliance, and sanctioned intake."
            ),
            Bureau(
                name="Ragging Prevention Cell",
                code="RPC",
                description="Dedicated cell for monitoring anti-ragging compliance, emergency helpline referrals, and FIR tracking."
            ),
            Bureau(
                name="Policy & Academic Planning Bureau",
                code="PAPB",
                description="Oversees curriculum norms, faculty minimum qualification standards, and academic accreditation disputes."
            ),
            Bureau(
                name="Finance & Accounts Bureau",
                code="FAB",
                description="Monitors grant disbursements, institutional scholarship misappropriation, and financial audit objections."
            ),
        ]
        db.session.add_all(bureaus)
        db.session.flush()

        bureau_map = {b.code: b for b in bureaus}

        print("Seeding Authorized Portal Users...")
        # 1. Admin
        admin = User(
            name="Dr. Rajiv Sharma",
            email="admin@aicte.gov.in",
            role="admin",
            designation="Chief System Administrator & Director (IT)",
        )
        admin.set_password("Admin@12345")

        # 2. Bureau Officers
        officer_pgrc = User(
            name="Smt. Ananya Sen",
            email="officer.pgrc@aicte.gov.in",
            role="officer",
            bureau_id=bureau_map["PGRC"].id,
            designation="Senior Grievance Officer (PGRC)",
        )
        officer_pgrc.set_password("Officer@12345")

        officer_ab = User(
            name="Shri Vikramaditya Rao",
            email="officer.ab@aicte.gov.in",
            role="officer",
            bureau_id=bureau_map["AB"].id,
            designation="Joint Director (Approval Bureau)",
        )
        officer_ab.set_password("Officer@12345")

        officer_rpc = User(
            name="Dr. Meenakshi Sundaram",
            email="officer.rpc@aicte.gov.in",
            role="officer",
            bureau_id=bureau_map["RPC"].id,
            designation="Anti-Ragging Coordination Officer",
        )
        officer_rpc.set_password("Officer@12345")

        # 3. Senior Read-Only Authority
        director_monitoring = User(
            name="Prof. K. V. Ramanathan",
            email="director.monitoring@aicte.gov.in",
            role="senior_authority",
            designation="Advisor & Member Secretary (Monitoring)",
        )
        director_monitoring.set_password("Director@12345")

        db.session.add_all([admin, officer_pgrc, officer_ab, officer_rpc, director_monitoring])
        db.session.flush()

        print("Seeding Institutions across States...")
        institutions = [
            Institution(
                institution_code="1-10293847",
                name="Apex Institute of Technology and Management",
                aliases='["Apex Inst. of Technology", "Apex Tech Bangalore", "AITM Bangalore"]',
                institution_type="Engineering & Technology",
                state="Karnataka",
                district="Bengaluru Urban",
                address="Survey No. 42/1, Electronic City Phase 1",
                pincode="560100",
                website="https://www.apextech-sample.edu.in",
            ),
            Institution(
                institution_code="1-48201948",
                name="National Institute of Technical Excellence",
                aliases='["NITE Pune", "National Tech Pune"]',
                institution_type="Engineering & Technology",
                state="Maharashtra",
                district="Pune",
                address="Hinjawadi Infotech Park, Phase 2",
                pincode="411057",
                website="https://www.nite-pune-sample.edu.in",
            ),
            Institution(
                institution_code="1-77392014",
                name="Kalinga Academy of Pharmaceutical Sciences",
                aliases='["KAPS Bhubaneswar", "Kalinga Pharmacy"]',
                institution_type="Pharmacy",
                state="Odisha",
                district="Khurda",
                address="Plot 104, Chandaka Industrial Estate, Bhubaneswar",
                pincode="751024",
                website="https://www.kalinga-pharm-sample.edu.in",
            ),
            Institution(
                institution_code="1-33920194",
                name="Delhi Institute of Advanced Polytechnic Studies",
                aliases='["DIAPS Delhi", "Delhi Adv Poly"]',
                institution_type="Polytechnic",
                state="Delhi",
                district="South West Delhi",
                address="Institutional Area, Sector 9, Dwarka",
                pincode="110077",
                website="https://www.diaps-delhi-sample.edu.in",
            ),
            Institution(
                institution_code="1-99201842",
                name="Saraswati College of Engineering and Architecture",
                aliases='["SCEA Lucknow", "Saraswati Engg Lucknow"]',
                institution_type="Engineering & Technology",
                state="Uttar Pradesh",
                district="Lucknow",
                address="Faizabad Road, Chinhat, Lucknow",
                pincode="226028",
                website="https://www.scea-lucknow-sample.edu.in",
            ),
            Institution(
                institution_code="1-55829103",
                name="St. Xavier Institute of Business Management",
                aliases='["SXIBM Chennai", "St Xavier Management Chennai"]',
                institution_type="Management",
                state="Tamil Nadu",
                district="Chennai",
                address="Mount Road, Guindy, Chennai",
                pincode="600032",
                website="https://www.sxibm-chennai-sample.edu.in",
            ),
        ]
        db.session.add_all(institutions)
        db.session.flush()
        inst_map = {i.institution_code: i for i in institutions}

        print("Seeding Rich Complaint Scenarios...")
        now = datetime.now(timezone.utc)

        # -------------------------------------------------------------
        # SCENARIO A: Cross-Bureau Potential Overlap (PGRC vs Approval Bureau)
        # -------------------------------------------------------------
        # Comp 1: In PGRC
        c1 = Complaint(
            case_number="AICTE-2026-PGRC-0001",
            external_reference="CPGRAMS-2026-E-04829",
            institution_id=inst_map["1-10293847"].id,  # Apex Institute
            category="Fee Overcharging / Capitation",
            subject="Extortionate unapproved capitation fee and withholding original certificates",
            description="B.Tech Computer Science 2nd-year students report that the management is coercively demanding Rs. 1,50,000 as annual 'infrastructure development caution fee' not listed in the AICTE-approved prospectus, and withholding original 10th/12th marksheets until paid.",
            receiving_bureau_id=bureau_map["PGRC"].id,
            current_bureau_id=bureau_map["PGRC"].id,
            assigned_user_id=officer_pgrc.id,
            priority="High",
            status="Under Review",
            received_at=now - timedelta(days=14),
            due_at=now + timedelta(days=16),
            last_action_at=now - timedelta(days=3),
        )
        db.session.add(c1)
        db.session.flush()

        act1 = CaseAction(
            complaint_id=c1.id,
            action_type="status_change",
            description="Grievance prima-facie verified against fee notification guidelines. Hearing notice issued to Institution Principal.",
            old_status="Received",
            new_status="Under Review",
            old_bureau_id=bureau_map["PGRC"].id,
            new_bureau_id=bureau_map["PGRC"].id,
            performed_by_id=officer_pgrc.id,
            created_at=now - timedelta(days=3),
        )
        db.session.add(act1)

        # Comp 2: In Approval Bureau (AB) for same institution, overlapping complaint!
        c2 = Complaint(
            case_number="AICTE-2026-AB-0002",
            external_reference="CPGRAMS-2026-E-04829",  # Identical external ref!
            institution_id=inst_map["1-10293847"].id,  # Apex Institute
            category="Fee Overcharging / Capitation",
            subject="Regulatory violation: Capitation fee collection during admission and withheld documents",
            description="Parent delegation petition alleging Apex Institute of Technology is flouting Approval Handbook Section 4 norms by charging mandatory undocumented caution fees and retaining original documents of engineering candidates.",
            receiving_bureau_id=bureau_map["AB"].id,
            current_bureau_id=bureau_map["AB"].id,
            assigned_user_id=officer_ab.id,
            priority="High",
            status="Action Required",
            received_at=now - timedelta(days=5),
            due_at=now + timedelta(days=10),
            last_action_at=now - timedelta(days=1),
        )
        db.session.add(c2)
        db.session.flush()

        act2 = CaseAction(
            complaint_id=c2.id,
            action_type="status_change",
            description="Complaint received from Member Secretary office. Scrutiny committee flagged possible withdrawal of approval recommendation.",
            old_status="Received",
            new_status="Action Required",
            old_bureau_id=bureau_map["AB"].id,
            new_bureau_id=bureau_map["AB"].id,
            performed_by_id=officer_ab.id,
            created_at=now - timedelta(days=1),
        )
        db.session.add(act2)

        # -------------------------------------------------------------
        # SCENARIO B: Same Institution, completely unrelated matters
        # -------------------------------------------------------------
        c3 = Complaint(
            case_number="AICTE-2026-AB-0003",
            external_reference="E-GOV-2026-7712",
            institution_id=inst_map["1-48201948"].id,  # National Institute of Technical Excellence (Pune)
            category="Infrastructure Deficiencies",
            subject="Deficient chemistry lab safety equipment and lack of ventilation",
            description="Audit observation regarding non-functional fume hoods and absence of emergency eyewash stations in the 1st year chemistry lab at Hinjawadi campus.",
            receiving_bureau_id=bureau_map["AB"].id,
            current_bureau_id=bureau_map["AB"].id,
            assigned_user_id=officer_ab.id,
            priority="Medium",
            status="Under Review",
            received_at=now - timedelta(days=20),
            due_at=now + timedelta(days=10),
            last_action_at=now - timedelta(days=5),
        )
        db.session.add(c3)
        db.session.flush()

        c4 = Complaint(
            case_number="AICTE-2026-RPC-0004",
            external_reference="UGC-AR-2026-8812",
            institution_id=inst_map["1-48201948"].id,  # Same institution (Pune)
            category="Ragging Incident",
            subject="Hostel verbal intimidation and late-night roll-call harassment",
            description="Complaint received via National Anti-Ragging helpline regarding senior students enforcing unauthorized dress codes and midnight attendance in Boys Hostel Block C.",
            receiving_bureau_id=bureau_map["RPC"].id,
            current_bureau_id=bureau_map["RPC"].id,
            assigned_user_id=officer_rpc.id,
            priority="High",
            status="Under Review",
            received_at=now - timedelta(days=12),
            due_at=now + timedelta(days=3),
            last_action_at=now - timedelta(days=2),
        )
        db.session.add(c4)
        db.session.flush()

        # -------------------------------------------------------------
        # SCENARIO C: Overdue Complaint (Past Due Date, Action Required)
        # -------------------------------------------------------------
        c5 = Complaint(
            case_number="AICTE-2026-PAPB-0005",
            external_reference="FAC-SAL-2026-0091",
            institution_id=inst_map["1-77392014"].id,  # Kalinga Academy
            category="Faculty Quality / Non-Payment",
            subject="Non-disbursement of faculty salaries for 6 months and PF non-remittance",
            description="Faculty association memorandum stating that 28 approved assistant and associate professors have not received their legitimate salaries since October 2025.",
            receiving_bureau_id=bureau_map["PAPB"].id,
            current_bureau_id=bureau_map["PAPB"].id,
            assigned_user_id=None,
            priority="Critical",
            status="Action Required",
            received_at=now - timedelta(days=35),
            due_at=now - timedelta(days=14),  # OVERDUE by 14 days!
            last_action_at=now - timedelta(days=15),
        )
        db.session.add(c5)
        db.session.flush()

        # -------------------------------------------------------------
        # SCENARIO D: Fully Resolved Complaint with Complete Audit Trail
        # -------------------------------------------------------------
        c6 = Complaint(
            case_number="AICTE-2026-PGRC-0006",
            external_reference="CPGRAMS-2025-E-99120",
            institution_id=inst_map["1-33920194"].id,  # Delhi Polytechnic
            category="Admission Irregularity",
            subject="Non-refund of admission tuition fee after timely seat cancellation",
            description="Student applied for seat withdrawal within the AICTE cut-off deadline; institution initially refused to process the refund of Rs. 45,000.",
            receiving_bureau_id=bureau_map["PGRC"].id,
            current_bureau_id=bureau_map["PGRC"].id,
            assigned_user_id=officer_pgrc.id,
            priority="Medium",
            status="Disposed",
            received_at=now - timedelta(days=60),
            due_at=now - timedelta(days=30),
            last_action_at=now - timedelta(days=10),
            disposed_at=now - timedelta(days=10),
            resolution_summary="Institution remitted complete refund of Rs. 44,000 (after Rs. 1,000 processing fee deduction as per norms) via RTGS UTR#SBIN20260210019284. Bank confirmation verified by officer.",
        )
        db.session.add(c6)
        db.session.flush()

        # Actions for C6
        a6_1 = CaseAction(
            complaint_id=c6.id,
            action_type="case_intake",
            description="Case registered under PGRC portal. Student provided cancellation receipt and bank details.",
            old_status=None,
            new_status="Received",
            performed_by_id=officer_pgrc.id,
            created_at=now - timedelta(days=60),
        )
        a6_2 = CaseAction(
            complaint_id=c6.id,
            action_type="status_change",
            description="Direct directive issued to Institution Registrar citing AICTE Refund Policy Circular 2025-26.",
            old_status="Received",
            new_status="Under Review",
            performed_by_id=officer_pgrc.id,
            created_at=now - timedelta(days=45),
        )
        a6_3 = CaseAction(
            complaint_id=c6.id,
            action_type="disposition",
            description="Institution submitted RTGS transaction proof. Complainant confirmed receipt of refund. Case officially disposed.",
            old_status="Under Review",
            new_status="Disposed",
            performed_by_id=officer_pgrc.id,
            created_at=now - timedelta(days=10),
        )
        db.session.add_all([a6_1, a6_2, a6_3])

        # Additional active complaints for realistic metrics
        c7 = Complaint(
            case_number="AICTE-2026-AB-0007",
            external_reference="EOA-DEF-2026-0129",
            institution_id=inst_map["1-99201842"].id,  # Saraswati College Lucknow
            category="Approval / Accreditation Fraud",
            subject="Discrepancy in faculty cadre ratio submitted for Extension of Approval (EoA)",
            description="Physical inspection revealed ghost faculty entries on college rolls that do not match Aadhaar biometric authentication records.",
            receiving_bureau_id=bureau_map["AB"].id,
            current_bureau_id=bureau_map["AB"].id,
            assigned_user_id=officer_ab.id,
            priority="Critical",
            status="Escalated",
            received_at=now - timedelta(days=18),
            due_at=now + timedelta(days=2),
            last_action_at=now - timedelta(days=2),
        )
        db.session.add(c7)
        db.session.flush()

        c8 = Complaint(
            case_number="AICTE-2026-PGRC-0008",
            external_reference="CPGRAMS-2026-E-11029",
            institution_id=inst_map["1-55829103"].id,  # St. Xavier Chennai
            category="General Administration",
            subject="Delayed issuance of final semester grade sheets and provisional degree",
            description="MBA batch of 2025 graduating students have not been provided their degree documents, impacting campus placement joining dates.",
            receiving_bureau_id=bureau_map["PGRC"].id,
            current_bureau_id=bureau_map["PGRC"].id,
            assigned_user_id=officer_pgrc.id,
            priority="Low",
            status="Awaiting Response",
            received_at=now - timedelta(days=8),
            due_at=now + timedelta(days=22),
            last_action_at=now - timedelta(days=1),
        )
        db.session.add(c8)
        db.session.flush()

        db.session.commit()

        print("Executing Automated Overlap Detection Engine across seeded complaints...")
        # Run overlap engine for all complaints
        all_comps = db.session.query(Complaint).all()
        for c in all_comps:
            scan_complaint_overlaps(c.id)

        print("\nSeed data loaded successfully!")
        print("----------------------------------------------------------------")
        print("Default Test Accounts:")
        print("1. System Admin:         admin@aicte.gov.in          / Admin@12345")
        print("2. PGRC Officer:         officer.pgrc@aicte.gov.in   / Officer@12345")
        print("3. Approval Officer:     officer.ab@aicte.gov.in     / Officer@12345")
        print("4. Senior Read-Only:     director.monitoring@aicte.gov.in / Director@12345")
        print("----------------------------------------------------------------")

if __name__ == "__main__":
    seed_database()
