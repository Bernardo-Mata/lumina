import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.examples") 
engine = create_engine(os.getenv("SQLALCHEMY_DATABASE_URL"), connect_args={"charset": "utf8mb4"})  
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()