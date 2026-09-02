from __future__ import annotations
import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, UniqueConstraint, LargeBinary
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class StandardStatus(str, enum.Enum):
    CURRENT = "CURRENT"
    SUPERSEDED = "SUPERSEDED"
    WITHDRAWN = "WITHDRAWN"
    UNDER_REVISION = "UNDER_REVISION"

class CertificationType(str, enum.Enum):
    NONE = "NONE"
    BIS_PRODUCT = "BIS_PRODUCT"
    CRS = "CRS"
    HALLMARK = "HALLMARK"
    BIS_ISI = "BIS_ISI"

class ReferenceType(str, enum.Enum):
    NORMATIVE = "NORMATIVE"
    INFORMATIVE = "INFORMATIVE"
    TEST_METHOD = "TEST_METHOD"
    TERMINOLOGY = "TERMINOLOGY"
    SAFETY = "SAFETY"
    INSTALLATION = "INSTALLATION"
    RELATED_PRODUCT = "RELATED_PRODUCT"

class IndianStandard(Base):
    __tablename__ = "indian_standards"

    id = Column(Integer, primary_key=True, index=True)
    is_number = Column(String, unique=True, index=True, nullable=False)
    part = Column(String, nullable=True)
    section = Column(String, nullable=True)
    title = Column(String, nullable=False)
    scope = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    subject_area = Column(String, nullable=True)
    division = Column(String, nullable=True)
    technical_committee = Column(String, nullable=True)
    year_of_publication = Column(Integer, nullable=True)
    latest_year = Column(Integer, nullable=True)
    status = Column(Enum(StandardStatus), default=StandardStatus.CURRENT)
    superseded_by = Column(String, nullable=True)
    is_mandatory_certification = Column(Boolean, default=False)
    certification_type = Column(Enum(CertificationType), default=CertificationType.NONE)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    amendments = relationship("StandardAmendment", back_populates="standard")
    source_references = relationship("NormativeReference", foreign_keys="NormativeReference.source_standard_id", back_populates="source_standard")
    target_references = relationship("NormativeReference", foreign_keys="NormativeReference.target_standard_id", back_populates="target_standard")
    embeddings = relationship("StandardEmbedding", back_populates="standard", uselist=False)

class StandardAmendment(Base):
    __tablename__ = "standard_amendments"

    id = Column(Integer, primary_key=True, index=True)
    standard_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    amendment_number = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    is_latest = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    standard = relationship("IndianStandard", back_populates="amendments")

class NormativeReference(Base):
    __tablename__ = "normative_references"

    id = Column(Integer, primary_key=True, index=True)
    source_standard_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    target_standard_id = Column(Integer, ForeignKey("indian_standards.id"), nullable=False)
    reference_type = Column(Enum(ReferenceType), nullable=False)

    __table_args__ = (
        UniqueConstraint("source_standard_id", "target_standard_id", "reference_type", name="uq_normative_reference"),
    )

    source_standard = relationship("IndianStandard", foreign_keys=[source_standard_id], back_populates="source_references")
    target_standard = relationship("IndianStandard", foreign_keys=[target_standard_id], back_populates="target_references")

class StandardEmbedding(Base):
    __tablename__ = "standard_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    standard_id = Column(Integer, ForeignKey("indian_standards.id"), unique=True, nullable=False)
    embedding_vector = Column(LargeBinary, nullable=False)
    embedding_model = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    standard = relationship("IndianStandard", back_populates="embeddings")
