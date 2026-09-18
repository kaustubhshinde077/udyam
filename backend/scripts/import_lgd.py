import os
import sys
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("../.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_or_create_location(name, location_type, parent_id, lgd_code, local_name=None):
    result = (
        supabase.table("locations")
        .select("id")
        .eq("source", "lgd")
        .eq("external_code", str(lgd_code))
        .execute()
    )

    if result.data:
        return result.data[0]["id"]

    result = (
        supabase.table("locations")
        .insert({
            "name": name,
            "local_name": local_name,
            "location_type": location_type,
            "parent_id": parent_id,
            "source": "lgd",
            "external_code": str(lgd_code),
        })
        .execute()
    )

    return result.data[0]["id"]


def import_villages(csv_path, state_name, state_code,
                    district_name, district_code,
                    sub_district_name, sub_district_code):

    df = pd.read_csv(csv_path)

    print(f"Found {len(df)} village records")

    state_id = get_or_create_location(
        state_name,
        "state",
        None,
        state_code
    )

    district_id = get_or_create_location(
        district_name,
        "district",
        state_id,
        district_code
    )

    sub_district_id = get_or_create_location(
        sub_district_name,
        "sub_district",
        district_id,
        sub_district_code
    )

    villages = []

    for _, row in df.iterrows():
        villages.append({
            "name": str(row["Village Name (In English)"]).strip(),
            "local_name": str(row["Village Name (In Local language)"]).strip(),
            "location_type": "village",
            "parent_id": sub_district_id,
            "source": "lgd",
            "external_code": str(row["Village LGD Code"]).strip(),
        })

    if villages:
        supabase.table("locations").upsert(
            villages,
            on_conflict="source,external_code"
        ).execute()

    print(f"Imported {len(villages)} villages")
    print("LGD import complete.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python import_lgd.py <csv_file>")
        sys.exit(1)

    import_villages(
        csv_path=sys.argv[1],
        state_name="Maharashtra",
        state_code=27,
        district_name="Dhule",
        district_code=474,
        sub_district_name="Dhule",
        sub_district_code=3959
    )