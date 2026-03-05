from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# author schemas

class AuthorCreate(BaseModel):
    """schema for creating a new author"""
    first_name: str = Field(..., min_length=1, max_length=100, examples=["George"])
    last_name: str = Field(..., min_length=1, max_length=100, examples=["Orwell"])
    email: EmailStr = Field(..., examples=["george.orwell@example.com"])


class AuthorUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None


class AuthorResponse(BaseModel):
    """schema for author data returned in responses"""
    id: int
    first_name: str
    last_name: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# book schemas

class BookCreate(BaseModel):
    """schema for creating a new book"""
    title: str = Field(..., min_length=1, max_length=255, examples=["1984"])
    isbn: str = Field(..., min_length=1, max_length=20, examples=["978-0451524935"])
    publication_year: int = Field(..., ge=1000, le=2100, examples=[1949])
    available_copies: int = Field(default=1, ge=0, examples=[5])
    author_id: int = Field(..., ge=1, examples=[1])


class BookUpdate(BaseModel):
    """schema for updating a book, all fields are optional"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    isbn: Optional[str] = Field(None, min_length=1, max_length=20)
    publication_year: Optional[int] = Field(None, ge=1000, le=2100)
    available_copies: Optional[int] = Field(None, ge=0)
    author_id: Optional[int] = Field(None, ge=1)


class BookResponse(BaseModel):
    """schema for book data returned in responses"""
    id: int
    title: str
    isbn: str
    publication_year: int
    available_copies: int
    author_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True