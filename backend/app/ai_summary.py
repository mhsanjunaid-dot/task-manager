import os
import datetime
from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Groq SDK exceptions
from groq import Groq
from groq import NotFoundError, BadRequestError

from app.database import get_db
from app import models

router = APIRouter(prefix="/ai", tags=["AI Summary"])

# initialize Groq client (will be None if no key present)
GROQ_KEY = os.getenv("GROQ_API_KEY")
client: Optional[Groq] = Groq(api_key=GROQ_KEY) if GROQ_KEY else None


def _summarize_tasks_from_db(db: Session) -> str:
    """
    Build a concise 3-4 sentence summary from actual tasks in the DB.
    This is the fallback if Groq is unavailable or model access is denied.
    """
    tasks = db.query(models.Task).all()

    total = len(tasks)
    pending = sum(1 for t in tasks if (t.status or "pending") == "pending")
    in_progress = sum(1 for t in tasks if (t.status or "") == "in-progress")
    completed = sum(1 for t in tasks if (t.status or "") == "completed")

    now = datetime.datetime.utcnow()
    overdue = 0
    for t in tasks:
        try:
            if t.deadline:
                
                d = t.deadline
                if isinstance(d, str):
                    d = datetime.datetime.fromisoformat(d)
                if d < now and (t.status or "pending") != "completed":
                    overdue += 1
        except Exception:
            
            pass

    
    parts = []
    parts.append(f"You have {total} tasks in total: {completed} completed, {in_progress} in progress, and {pending} pending.")
    if overdue:
        parts.append(f"{overdue} task{'s' if overdue>1 else ''} are overdue — consider prioritizing them.")
    else:
        parts.append("No tasks are overdue at the moment.")
    parts.append("Keep going — focus on the highest-priority pending items this week.")

    return " ".join(parts)


@router.get("/weekly-summary")
def get_weekly_summary(db: Session = Depends(get_db)):
    """
    1) Try to use Groq to generate a friendly weekly summary.
    2) If Groq fails (missing key, model access, or other error), return a DB-generated fallback.
    """
    prompt = "Generate a clear, friendly weekly summary of the user's tasks in 3–4 short sentences."

    
    if client is None:
        fallback = _summarize_tasks_from_db(db)
        return {"summary": fallback}

    
    try:
        completion = client.chat.completions.create(
            model="llama3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
        )

        
        msg = completion.choices[0].message
        if isinstance(msg, dict):
            summary_text = msg.get("content", "")
        else:
            
            summary_text = getattr(msg, "content", "") or getattr(msg, "text", "")

        
        if not summary_text:
            raise ValueError("Empty response from Groq")

        return {"summary": summary_text}

    except NotFoundError as nf:
       
        fallback = _summarize_tasks_from_db(db)
        return {"summary": fallback}

    except BadRequestError:
       
        fallback = _summarize_tasks_from_db(db)
        return {"summary": fallback}

    except Exception:
        
        fallback = _summarize_tasks_from_db(db)
        return {"summary": fallback}
