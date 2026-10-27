import os
import sys
from datetime import datetime, timezone, timedelta

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.models import db, Bureau, User, Institution, Complaint, CaseAction, CaseLink, Notification, AuditEvent

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

        print("Seeding Authorized Portal Users across the 3 Levels...")
        # 1. System Admin (userid: admin, password: admin)
        admin = User(
            name="Dr. Rajiv Sharma",
            email="admin@aicte.gov.in",
            role="SYSTEM_ADMIN",
            designation="Chief System Administrator & Director (IT)",
        )
        admin.set_password("admin")

        # 2. Industry Accounts
        industry_desk = User(
            name="Grievance Redressal Industry Desk",
            email="industry@aicte.gov.in",
            role="INDUSTRY",
            bureau_id=bureau_map["PGRC"].id,
            designation="Senior Grievance Coordinator",
        )
        industry_desk.set_password("industry")

        officer_pgrc = User(
            name="Smt. Ananya Sen",
            email="officer.pgrc@aicte.gov.in",
            role="INDUSTRY",
            bureau_id=bureau_map["PGRC"].id,
            designation="Senior Grievance Officer (PGRC)",
        )
        officer_pgrc.set_password("Officer@12345")

        officer_ab = User(
            name="Shri Vikramaditya Rao",
            email="officer.ab@aicte.gov.in",
            role="INDUSTRY",
            bureau_id=bureau_map["AB"].id,
            designation="Joint Director (Approval Bureau)",
        )
        officer_ab.set_password("Officer@12345")

        officer_rpc = User(
            name="Dr. Meenakshi Sundaram",
            email="officer.rpc@aicte.gov.in",
            role="INDUSTRY",
            bureau_id=bureau_map["RPC"].id,
            designation="Anti-Ragging Coordination Officer",
        )
        officer_rpc.set_password("Officer@12345")

        # 3. User / Complainant Account
        user_citizen = User(
            name="Pooja Sharma (Student Complainant)",
            email="user@aicte.gov.in",
            role="USER",
            designation="Citizen Complainant",
        )
        user_citizen.set_password("user")

        db.session.add_all([admin, industry_desk, officer_pgrc, officer_ab, officer_rpc, user_citizen])
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

        print("Seeding Initial Complaint Records...")
        now = datetime.now(timezone.utc)
        c1 = Complaint(
            case_number="AICTE-26-PGRC-0101",
            ticket_number="AICTE-2026-PG0101",
            external_reference="CPGRAMS/2026/004189",
            institution_id=institutions[0].id,
            category="Fee irregularity",
            subject="Reported capitation fee collection during admission",
            description="The complainant reports an additional payment being requested outside the published fee schedule.",
            receiving_bureau_id=bureau_map["PGRC"].id,
            current_bureau_id=bureau_map["PGRC"].id,
            assigned_user_id=officer_pgrc.id,
            priority="Critical",
            status="Action Required",
            received_at=now - timedelta(days=18),
            due_at=now - timedelta(days=2),
            last_action_at=now - timedelta(days=5),
            created_at=now - timedelta(days=18),
        )
        c2 = Complaint(
            case_number="AICTE-26-AB-0102",
            ticket_number="AICTE-2026-AB0102",
            external_reference="CPGRAMS/2026/004189",
            institution_id=institutions[0].id,
            category="Admission irregularity",
            subject="Review of admission-related fee complaint",
            description="Review requested on the institution fee schedule and additional admission charges reported by applicants.",
            receiving_bureau_id=bureau_map["AB"].id,
            current_bureau_id=bureau_map["AB"].id,
            assigned_user_id=officer_ab.id,
            priority="High",
            status="Under Review",
            received_at=now - timedelta(days=14),
            due_at=now + timedelta(days=3),
            last_action_at=now - timedelta(days=1),
            created_at=now - timedelta(days=14),
        )
        c3 = Complaint(
            case_number="AICTE-26-PAPB-0103",
            ticket_number="AICTE-2026-PA0103",
            institution_id=institutions[0].id,
            category="Faculty compliance",
            subject="Faculty qualification records need verification",
            description="Submitted faculty qualification documents appear incomplete and require a bureau-level review.",
            receiving_bureau_id=bureau_map["PAPB"].id,
            current_bureau_id=bureau_map["PAPB"].id,
            priority="Medium",
            status="Awaiting Response",
            received_at=now - timedelta(days=9),
            due_at=now + timedelta(days=6),
            last_action_at=now - timedelta(days=2),
            created_at=now - timedelta(days=9),
        )
        c4 = Complaint(
            case_number="AICTE-26-RPC-0104",
            ticket_number="AICTE-2026-RP0104",
            institution_id=institutions[1].id,
            category="Student safety",
            subject="Follow-up required on student safety report",
            description="A follow-up report requested from the institution has not yet been received.",
            receiving_bureau_id=bureau_map["RPC"].id,
            current_bureau_id=bureau_map["RPC"].id,
            assigned_user_id=officer_rpc.id,
            priority="High",
            status="Escalated",
            received_at=now - timedelta(days=23),
            due_at=now - timedelta(days=7),
            last_action_at=now - timedelta(days=8),
            created_at=now - timedelta(days=23),
        )
        c5 = Complaint(
            case_number="AICTE-26-FAB-0105",
            ticket_number="AICTE-2026-JB92C9",
            institution_id=institutions[1].id,
            category="Financial records",
            subject="Scholarship disbursement reconciliation",
            description="Request to reconcile the recorded disbursement and the payment schedule supplied by the institution.",
            complainant_name=user_citizen.name,
            complainant_email=user_citizen.email,
            created_by_user_id=user_citizen.id,
            receiving_bureau_id=bureau_map["FAB"].id,
            current_bureau_id=bureau_map["FAB"].id,
            priority="Medium",
            status="Under Review",
            received_at=now - timedelta(days=7),
            due_at=now + timedelta(days=8),
            last_action_at=now - timedelta(days=2),
            created_at=now - timedelta(days=7),
        )
        db.session.add_all([c1, c2, c3, c4, c5])
        db.session.flush()

        link = CaseLink(
            complaint_id_a=c1.id,
            complaint_id_b=c2.id,
            relationship_type="potential_overlap",
            match_score=0.93,
            match_method="Identifier + text similarity",
            match_reason="Both records reference the same institution and external complaint reference. The descriptions concern admission-related fees.",
            review_status="pending",
        )
        db.session.add(link)

        act1 = CaseAction(
            complaint_id=c5.id,
            action_type="Submitted",
            description="Grievance registered in the centralized complaint register.",
            performed_by_id=user_citizen.id,
            created_at=now - timedelta(days=7),
        )
        act2 = CaseAction(
            complaint_id=c5.id,
            action_type="Under Review",
            description="Assigned to Finance & Accounts Bureau for scholarship audit reconciliation.",
            performed_by_id=industry_desk.id,
            created_at=now - timedelta(days=2),
        )
        db.session.add_all([act1, act2])

        db.session.commit()

        print("\nMaster seed data loaded successfully!")
        print("----------------------------------------------------------------")
        print("Default Accounts:")
        print("1. System Admin (User ID: admin / Password: admin): admin@aicte.gov.in")
        print("2. PGRC Officer:         officer.pgrc@aicte.gov.in   / Officer@12345")
        print("3. Approval Officer:     officer.ab@aicte.gov.in     / Officer@12345")
        print("4. Senior Read-Only:     director.monitoring@aicte.gov.in / Director@12345")
        print("----------------------------------------------------------------")

if __name__ == "__main__":
    seed_database()
