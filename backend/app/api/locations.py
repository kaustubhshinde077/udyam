from typing import Literal
from uuid import UUID

from fastapi import APIRouter

from app.db.supabase import supabase

router = APIRouter(prefix="/locations", tags=["Locations"])
LocationType = Literal["state", "district", "sub_district", "village"]


@router.get("")
def list_locations(type: LocationType, parent_id: UUID | None = None):
    query = (
        supabase.table("locations")
        .select("id, name, local_name, location_type, parent_id")
        .eq("location_type", type)
        .order("name")
    )

    if parent_id is None:
        query = query.is_("parent_id", "null")
    else:
        query = query.eq("parent_id", str(parent_id))

    result = query.execute()
    return {"locations": result.data or []}
