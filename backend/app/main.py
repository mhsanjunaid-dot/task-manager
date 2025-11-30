from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.tasks import router as tasks_router

from app.database import Base, engine
from app import models

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def create_tables():
    print("📌 Creating database tables (if they do not exist)...")
    Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(tasks_router)
