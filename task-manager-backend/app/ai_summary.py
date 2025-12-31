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
    Enhanced motivational weekly summary built directly from DB data.
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
                if d < now and (t.status or "") != "completed":
                    overdue += 1
        except Exception:
            pass

    # --- Build human-friendly motivational summary ---
    summary = []

    summary.append(
        f"You managed {total} tasks this week — with {completed} completed, {in_progress} in progress, and {pending} still pending. "
    )

    if completed > 0:
        summary.append(
            f"Great job finishing {completed}! That shows solid consistency and focus. "
        )
    else:
        summary.append(
            "This week was heavy, but you kept moving. Every small step counts. "
        )

    if pending > 0:
        summary.append(
            f"You still have {pending} pending tasks. Try tackling one or two high-impact items next to keep your momentum strong. "
        )

    if overdue > 0:
        summary.append(
            f"{overdue} task{'s' if overdue > 1 else ''} slipped past the deadline — totally fine, just bring them back into your plan and move forward. "
        )
    else:
        summary.append(
            "Good news: none of your tasks are overdue right now — you're managing your timeline well. "
        )

    summary.append(
        "You're doing better than you think. Stay steady, celebrate your progress, and take on the new week with confidence. 🌟"
    )

    return " ".join(summary)



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
