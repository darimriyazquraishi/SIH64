from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from .base import db

class Complaint(db.Model):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_number = Column(String(50), unique=True, nullable=True, index=True)  # Format: "AICTE-2026-XXXXXX"
    case_number = Column(String(50), unique=True, nullable=False, index=True)  # e.g., "AICTE-2026-PGRC-001"
    external_reference = Column(String(100), nullable=True, index=True)  # e.g., CPGRAMS ref: "DARPG/E/2026/00142"
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Complainant Details (Public Registration)
    complainant_name = Column(String(120), nullable=True)
    complainant_email = Column(String(120), nullable=True, index=True)
    complainant_mobile = Column(String(30), nullable=True)
    supporting_document_name = Column(String(255), nullable=True)
    supporting_document_url = Column(String(500), nullable=True)
    source = Column(String(30), default="Public Portal", nullable=False)
    
    receiving_bureau_id = Column(Integer, ForeignKey("bureaus.id"), nullable=False)
    current_bureau_id = Column(Integer, ForeignKey("bureaus.id"), nullable=False)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    priority = Column(String(20), default="Medium", nullable=False)  # "Low", "Medium", "High", "Critical"
    status = Column(String(30), default="Received", nullable=False)    # "Received", "Under Review", "Action Required", "Awaiting Response", "Escalated", "Disposed", "Closed"
    
    received_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    due_at = Column(DateTime, nullable=True)
    last_action_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    disposed_at = Column(DateTime, nullable=True)
    resolution_summary = Column(Text, nullable=True)
    
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    institution = relationship("Institution", back_populates="complaints")
    receiving_bureau = relationship("Bureau", foreign_keys=[receiving_bureau_id], back_populates="received_complaints")
    current_bureau = relationship("Bureau", foreign_keys=[current_bureau_id], back_populates="current_complaints")
    assigned_officer = relationship("User", foreign_keys=[assigned_user_id], back_populates="assigned_complaints")
    created_by_user = relationship("User", foreign_keys=[created_by_user_id])
    
    actions = relationship("CaseAction", back_populates="complaint", cascade="all, delete-orphan", order_by="CaseAction.created_at.desc()")
    
    links_as_a = relationship("CaseLink", foreign_keys="CaseLink.complaint_id_a", back_populates="complaint_a", cascade="all, delete-orphan")
    links_as_b = relationship("CaseLink", foreign_keys="CaseLink.complaint_id_b", back_populates="complaint_b", cascade="all, delete-orphan")

    @property
    def is_overdue(self) -> bool:
        if self.status in ("Disposed", "Closed") or not self.due_at:
            return False
        # Handle naive or aware timestamps
        now = datetime.now(timezone.utc)
        due = self.due_at
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        return now > due

    def to_dict(self, include_details=False):
        data = {
            "id": self.id,
            "ticket_number": self.ticket_number or self.case_number,
            "case_number": self.case_number,
            "external_reference": self.external_reference,
            "complainant_name": self.complainant_name,
            "complainant_email": self.complainant_email,
            "complainant_mobile": self.complainant_mobile,
            "supporting_document_name": self.supporting_document_name,
            "supporting_document_url": self.supporting_document_url,
            "source": self.source,
            "institution_id": self.institution_id,
            "institution_name": self.institution.name if self.institution else None,
            "institution_code": self.institution.institution_code if self.institution else None,
            "institution_state": self.institution.state if self.institution else None,
            "category": self.category,
            "subject": self.subject,
            "description": self.description,
            "receiving_bureau_id": self.receiving_bureau_id,
            "receiving_bureau_code": self.receiving_bureau.code if self.receiving_bureau else None,
            "receiving_bureau_name": self.receiving_bureau.name if self.receiving_bureau else None,
            "current_bureau_id": self.current_bureau_id,
            "current_bureau_code": self.current_bureau.code if self.current_bureau else None,
            "current_bureau_name": self.current_bureau.name if self.current_bureau else None,
            "assigned_user_id": self.assigned_user_id,
            "assigned_officer_name": self.assigned_officer.name if self.assigned_officer else None,
            "priority": self.priority,
            "status": self.status,
            "is_overdue": self.is_overdue,
            "received_at": self.received_at.isoformat() if self.received_at else None,
            "due_at": self.due_at.isoformat() if self.due_at else None,
            "last_action_at": self.last_action_at.isoformat() if self.last_action_at else None,
            "disposed_at": self.disposed_at.isoformat() if self.disposed_at else None,
            "resolution_summary": self.resolution_summary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_details:
            data["actions"] = [a.to_dict() for a in self.actions]
            # Gather all links
            links = []
            for link in self.links_as_a:
                links.append(link.to_dict(perspective_complaint_id=self.id))
            for link in self.links_as_b:
                links.append(link.to_dict(perspective_complaint_id=self.id))
            data["related_links"] = links
        return data

    def to_public_dict(self, include_history: bool = False):
        """
        Public tracking representation for complainants.
        Strictly excludes internal officer names, user IDs, internal action remarks,
        overlap match scores, and internal audit events.
        """
        data = {
            "id": self.id,
            "ticket_number": self.ticket_number or self.case_number,
            "case_number": self.case_number,
            "status": self.status,
            "category": self.category,
            "subject": self.subject,
            "description": self.description,
            "institution_name": self.institution.name if self.institution else None,
            "institution_code": self.institution.institution_code if self.institution else None,
            "institution_state": self.institution.state if self.institution else None,
            "bureau_name": self.current_bureau.name if self.current_bureau else (self.receiving_bureau.name if self.receiving_bureau else None),
            "bureau_code": self.current_bureau.code if self.current_bureau else (self.receiving_bureau.code if self.receiving_bureau else None),
            "priority": self.priority,
            "received_at": self.received_at.isoformat() if self.received_at else None,
            "due_at": self.due_at.isoformat() if self.due_at else None,
            "last_action_at": self.last_action_at.isoformat() if self.last_action_at else None,
            "disposed_at": self.disposed_at.isoformat() if self.disposed_at else None,
            "resolution_summary": self.resolution_summary,
            "has_supporting_document": bool(self.supporting_document_name),
            "supporting_document_name": self.supporting_document_name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_history:
            history = []
            for a in self.actions:
                history.append({
                    "action_type": a.action_type,
                    "date": a.created_at.isoformat() if a.created_at else None,
                    "status": a.new_status or self.status,
                    "description": a.description if a.action_type in ("status_change", "case_intake") and not ("Remarks:" in (a.description or "")) else f"Status updated to '{a.new_status or self.status}'"
                })
            data["updates"] = history
        return data

