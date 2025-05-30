from fastapi import FastAPI
from API.database import Base, engine
from API.auth import router as auth_router
from API.backendRequest import router as backend_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O restringe a ["http://localhost:3000"] si usas React local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(backend_router)