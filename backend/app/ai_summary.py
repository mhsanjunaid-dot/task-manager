from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI Summary"])

@router.get("/weekly-summary")
def get_weekly_summary():
    return {"summary": "Your weekly summary goes here!"}
