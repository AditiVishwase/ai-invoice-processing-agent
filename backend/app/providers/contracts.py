from dataclasses import dataclass
from decimal import Decimal
from typing import Protocol


@dataclass(frozen=True)
class DocumentReference:
    key: str
    file_name: str
    content_type: str
    size_bytes: int


@dataclass(frozen=True)
class FieldEvidence:
    field_path: str
    raw_text: str
    confidence: Decimal | None = None
    page_number: int | None = None
    bounding_box: tuple[Decimal, Decimal, Decimal, Decimal] | None = None


@dataclass(frozen=True)
class ExtractedInvoice:
    fields: dict[str, object]
    evidence: tuple[FieldEvidence, ...]
    provider: str
    model: str


@dataclass(frozen=True)
class ErpExportResult:
    accepted: bool
    document_number: str | None
    response_code: str
    message: str


class ExtractionProvider(Protocol):
    async def extract_invoice(
        self,
        *,
        content: bytes,
        content_type: str,
    ) -> ExtractedInvoice: ...


class DocumentStorage(Protocol):
    async def save(
        self,
        *,
        content: bytes,
        file_name: str,
        content_type: str,
    ) -> DocumentReference: ...

    async def load(self, *, document_key: str) -> bytes: ...


class ErpAdapter(Protocol):
    async def export_invoice(
        self,
        *,
        payload: dict[str, object],
        idempotency_key: str,
    ) -> ErpExportResult: ...
