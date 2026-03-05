from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# UPDATE THE LINE BELOW WITH YOUR MySQL CREDENTIALS
DATABASE_URL = "mysql+pymysql://root:Aryan%40555@localhost:3306/library_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """dependency that provides a database session per request"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()