from fastapi import FastAPI
from API.auth import router as auth_router
from API.backendRequest import router as backend_router
from API.reporting import router as reporting_router
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(backend_router)
app.include_router(reporting_router)