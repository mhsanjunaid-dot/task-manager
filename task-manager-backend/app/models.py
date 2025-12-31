from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from .database import Base
from pydantic import BaseModel
from sqlalchemy.orm import relationship

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    category = Column(String, nullable=True)
    priority = Column(Integer, default=1)  
    deadline = Column(DateTime, nullable=True)
    status = Column(String, default="pending")  


    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
