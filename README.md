
TaskFlow – Full-Stack Task Management System
===========================================

A fully responsive task management platform built with Next.js, FastAPI, PostgreSQL, and JWT authentication.
Includes dashboards, task CRUD operations, deadline tracking, AI-powered weekly summaries, and backend unit testing.
This project fulfills all requirements of the Full-Stack Intern Assignment.

------------------------------------------------------------
LIVE DEPLOYMENT LINKS
------------------------------------------------------------
Frontend: https://task-manager-next.onrender.com
Backend: https://task-manager-0u9b.onrender.com

------------------------------------------------------------
DEMO VIDEOS
------------------------------------------------------------
Functional Walkthrough: https://youtu.be/pYLOGcVFUHM
Code Walkthrough: https://youtu.be/jjN7du5cnDk

------------------------------------------------------------
TABLE OF CONTENTS
------------------------------------------------------------
- Overview
- Tech Stack
- Key Features
- AI Summary Feature
- Architecture
- Project Structure
- Installation
- Environment Variables
- Testing
- Deployment
- Screenshots
- Submission Checklist

------------------------------------------------------------
OVERVIEW
------------------------------------------------------------
TaskFlow allows users to efficiently manage tasks with features like:
- Secure authentication
- Create, edit, delete tasks
- Track deadlines and priorities
- Fully responsive UI
- Search, filter, and sort
- Detailed task page
- AI-powered weekly summary
- JWT-based protected routes
- Deployed frontend + backend
- Backend unit testing

------------------------------------------------------------
TECH STACK
------------------------------------------------------------

Frontend:
- Next.js
- React (TypeScript)
- TailwindCSS
- Zustand / Context API

Backend:
- FastAPI
- SQLAlchemy ORM
- Pydantic v2
- Alembic migrations
- JWT Authentication
- PostgreSQL (production)
- SQLite (testing)

AI:
- Free inference API for summary generation

Testing:
- Pytest
- FastAPI TestClient
- SQLite test DB override

------------------------------------------------------------
KEY FEATURES
------------------------------------------------------------

Authentication:
- Signup + Login
- JWT protected API
- Frontend middleware redirection

Task Management:
- CRUD (Create, Read, Update, Delete)
- Category, priority, deadline, status
- Search and filter
- Countdown timers
- Task details page

AI Summary:
- Weekly productivity insight
- Reads completed + pending tasks
- Motivational summary
- Shows progress analysis

Responsive Design:
- Desktop, tablet, and mobile support

------------------------------------------------------------
AI SUMMARY FEATURE
------------------------------------------------------------
Backend compiles user tasks and sends them to a free AI inference endpoint.
AI returns:
- Weekly productivity review
- Recommendations
- Insights
- Encouragement

------------------------------------------------------------
ARCHITECTURE
------------------------------------------------------------
Frontend (Next.js)
    ↓
Backend API (FastAPI)
    ↓
PostgreSQL Database
    ↓
AI Summary Service

------------------------------------------------------------
PROJECT STRUCTURE
------------------------------------------------------------

Frontend:
src/
 app/(auth)/login
 app/(auth)/signup
 app/dashboard
 app/tasks/create
 app/tasks/[id]
 app/ai-summary
 components/
 store/
 middleware.ts

Backend:
app/
 main.py
 database.py
 models.py
 schemas.py
 auth.py
 ai_summary.py
 routes/auth_routes.py
 routes/tasks.py

tests/
 conftest.py
 test_tasks_auth.py

------------------------------------------------------------
INSTALLATION
------------------------------------------------------------

Backend:
1. cd task-manager-backend
2. python3 -m venv venv
3. source venv/bin/activate
4. pip install -r requirements.txt
5. uvicorn app.main:app --reload

Frontend:
1. cd task-manager-next
2. npm install
3. npm run dev

------------------------------------------------------------
ENVIRONMENT VARIABLES
------------------------------------------------------------

Backend (.env):
DATABASE_URL=postgres://...
JWT_SECRET=your_secret
AI_API_KEY=xxxx

Frontend (.env.local):
NEXT_PUBLIC_API_URL=https://task-manager-0u9b.onrender.com

------------------------------------------------------------
TESTING
------------------------------------------------------------
A backend test is included: tests/test_tasks_auth.py

It tests:
- Signup
- Login
- JWT generation
- Authenticated task creation

Run tests:
python3 -m pytest -q

------------------------------------------------------------
DEPLOYMENT
------------------------------------------------------------

Frontend → Render (Next.js static)
Backend → Render (FastAPI + PostgreSQL)
CORS enabled
Migrations run via Alembic

------------------------------------------------------------
SCREENSHOTS
------------------------------------------------------------

## 🖼 Screenshots

[Signup](./assets/screenshots/signup.png)
[Login](./assets/screenshots/login.png)
[Create Task](./assets/screenshots/create-task.png)
[Dashboard](./assets/screenshots/dashboard.png)
[Edit Task](./assets/screenshots/edit-task.png)
[Task Details](./assets/screenshots/task-details.png)
[AI Summary](./assets/screenshots/ai-summary.png)
[Mobile](./assets/screenshots/mobile-view.png)


------------------------------------------------------------
SUBMISSION CHECKLIST
------------------------------------------------------------
✓ Frontend deployed
✓ Backend deployed
✓ Auth implemented
✓ CRUD implemented
✓ AI feature completed
✓ Backend test included
✓ Screenshots added
✓ README fully completed
✓ Demo videos recorded

------------------------------------------------------------
END OF README
------------------------------------------------------------
