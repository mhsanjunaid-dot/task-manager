import os
from fastapi import APIRouter
from groq import Groq


router = APIRouter(prefix="/ai", tags=["AI Summary"])


client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.get("/weekly-summary")
def get_weekly_summary():
    """
    Generates a weekly summary using Groq AI.
    The frontend expects: { "summary": "..." }
    """

    prompt = "Generate a weekly summary of the user's tasks in 3–4 clear sentences."

   
    completion = client.chat.completions.create(
        model="llama3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
    )


    summary= completion.choices[0].message["content"]

    return {"summary": summary}
