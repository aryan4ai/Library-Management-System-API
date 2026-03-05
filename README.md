# Library Management System API

A RESTful API built with **FastAPI** and **MySQL** for managing books and authors, with a **React + Redux** frontend.


## What This Project Does

This is a full-stack library management system with two parts:

- **Backend (Part 1):** A FastAPI server connected to a MySQL database that lets you create, read, update, and delete books and authors through API endpoints.
- **Frontend (Part 2):** A React app using Redux Toolkit that connects to the backend and provides a clean UI for managing books.



## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, PyMySQL
- **Frontend:** React, Redux Toolkit, Axios
- **Database:** MySQL



## Database Design

The database has two tables with a one-to-many relationship (one author can have many books).

### Authors Table

| Column     | Type         | Constraints              |
|------------|-------------|--------------------------|
| id         | INT         | Primary Key, Auto Increment |
| first_name | VARCHAR(100)| Not Null                 |
| last_name  | VARCHAR(100)| Not Null                 |
| email      | VARCHAR(255)| Not Null, Unique         |
| created_at | TIMESTAMP   | Auto-generated           |
| updated_at | TIMESTAMP   | Auto-updated             |

### Books Table

| Column           | Type         | Constraints                     |
|-----------------|-------------|----------------------------------|
| id              | INT         | Primary Key, Auto Increment      |
| title           | VARCHAR(255)| Not Null                         |
| isbn            | VARCHAR(20) | Not Null, Unique                 |
| publication_year| INT         | Not Null                         |
| available_copies| INT         | Not Null, Default 1              |
| author_id       | INT         | Foreign Key -> authors.id        |
| created_at      | TIMESTAMP   | Auto-generated                   |
| updated_at      | TIMESTAMP   | Auto-updated                     |



## API Endpoints

### Authors

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | /authors/              | Create a new author      |
| GET    | /authors/              | Get all authors (paginated) |
| GET    | /authors/{id}          | Get a single author      |
| PUT    | /authors/{id}          | Update an author         |
| DELETE | /authors/{id}          | Delete an author         |

### Books

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | /books/                     | Create a new book              |
| GET    | /books/                     | Get all books (paginated)      |
| GET    | /books/{id}                 | Get a single book              |
| GET    | /books/author/{author_id}   | Get all books by an author     |
| PUT    | /books/{id}                 | Update a book                  |
| DELETE | /books/{id}                 | Delete a book                  |



## Validation and Error Handling

- Pydantic schemas validate all request and response data
- Email validation ensures proper email format for authors
- Unique constraints prevent duplicate emails and ISBNs
- Foreign key checks verify the author exists before creating a book
- Delete protection prevents deleting an author who still has books
- Proper HTTP status codes: 201 (created), 200 (success), 204 (deleted), 400 (bad request), 404 (not found)


## Project Structure

The backend lives in the **library-api** folder and contains the FastAPI app entry point (main.py), database connection setup (database.py), SQLAlchemy ORM models (models.py), Pydantic validation schemas (schemas.py), and a routers folder with separate files for author and book endpoints.

The frontend lives in the **library-frontend** folder and contains the main React component (App.js), styles (App.css), the entry point with Redux Provider (index.js), and a redux folder with the store configuration (store.js) and the books slice with async thunks (booksSlice.js).



## How to Run

### Prerequisites

Python 3.10 or higher, Node.js 16 or higher, and MySQL 8.0 or higher must be installed.

### Backend

Navigate to the library-api folder, create and activate a virtual environment, install the dependencies from requirements.txt, update the MySQL password in database.py, and start the server with uvicorn. The API will be available at http://127.0.0.1:8000 and the interactive Swagger docs at http://127.0.0.1:8000/docs.

### Frontend

Navigate to the library-frontend folder, install the npm dependencies, and run the app with npm start. The React app will open at http://localhost:3000. Make sure the backend server is running before using the frontend.
