from pydantic import BaseModel
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    priority: int | None = 1
    deadline: datetime | None = None
    status: str | None = "pending"


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: str | None = None
    priority: int | None = None
    deadline: datetime | None = None
    status: str | None = None
    completed: bool | None = None


class Task(TaskBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True  


class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True
