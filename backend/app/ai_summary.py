import os
from fastapi import APIRouter
from groq import Groq

router = APIRouter(prefix="/ai", tags=["AI Summary"])

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.get("/weekly-summary")
def get_weekly_summary():
    prompt = "Generate a weekly summary for the user's tasks in 3-4 lines."

    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    summary_text = completion.choices[0].message["content"]
    return {"summary": summary_text}
