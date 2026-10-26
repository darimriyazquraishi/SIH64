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
