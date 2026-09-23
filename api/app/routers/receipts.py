from typing import Annotated

from fastapi import APIRouter, Depends

from ..database import db
from ..models import ReceiptInput
from ..security import ApiPrincipal, require_scope

router = APIRouter(prefix="/publications", tags=["Recibos e consentimentos"])


@router.post("/{item_id}/receipts", status_code=201)
async def record_receipt(item_id: str, input: ReceiptInput, _: Annotated[ApiPrincipal, Depends(require_scope("receipts:write"))]):
    rows = await db.request("POST", "communication_receipts", json={"item_id": item_id, "user_id": str(input.user_id), "receipt_type": input.receipt_type, "metadata": input.metadata}, prefer="resolution=merge-duplicates,return=representation")
    return rows[0] if rows else {"item_id": item_id, "receipt_type": input.receipt_type}
