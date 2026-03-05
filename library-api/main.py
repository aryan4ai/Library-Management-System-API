from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import authors, books

app = FastAPI(
    title="Library Management System API",
    description="A RESTful API for managing books and authors.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authors.router)
app.include_router(books.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Library Management System API"}