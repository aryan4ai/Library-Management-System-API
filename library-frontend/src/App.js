import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  clearError,
} from "./redux/booksSlice";

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="error-banner">
      <span>{typeof message === "string" ? message : JSON.stringify(message)}</span>
      <button className="banner-close" onClick={onDismiss}>x</button>
    </div>
  );
}

function SuccessBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="success-banner">
      <span>{message}</span>
      <button className="banner-close" onClick={onDismiss}>x</button>
    </div>
  );
}

function BookForm({ initialData, onSubmit, submitLabel }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      isbn: "",
      publication_year: "",
      available_copies: 1,
      author_id: "",
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      publication_year: parseInt(form.publication_year, 10),
      available_copies: parseInt(form.available_copies, 10),
      author_id: parseInt(form.author_id, 10),
    });
    // Clear form if creating (not editing)
    if (!initialData) {
      setForm({
        title: "",
        isbn: "",
        publication_year: "",
        available_copies: 1,
        author_id: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. 1984" />
        </div>
        <div className="form-group">
          <label>ISBN</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} required placeholder="e.g. 978-0451524935" />
        </div>
        <div className="form-group">
          <label>Publication Year</label>
          <input name="publication_year" type="number" value={form.publication_year} onChange={handleChange} required placeholder="e.g. 1949" />
        </div>
        <div className="form-group">
          <label>Available Copies</label>
          <input name="available_copies" type="number" value={form.available_copies} onChange={handleChange} required placeholder="e.g. 5" />
        </div>
        <div className="form-group">
          <label>Author ID</label>
          <input name="author_id" type="number" value={form.author_id} onChange={handleChange} required placeholder="e.g. 1" />
        </div>
      </div>
      <button type="submit" className="submit-btn">{submitLabel}</button>
    </form>
  );
}

// ============================================================
// HOME SCREEN - Displays all books with Edit & Delete
// ============================================================

function HomeScreen() {
  const dispatch = useDispatch();
  const { items: books, status, error } = useSelector((state) => state.books);
  const [successMsg, setSuccessMsg] = useState(null);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      const result = await dispatch(deleteBook(id));
      if (!result.error) {
        setSuccessMsg(`"${title}" deleted successfully`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    }
  };

  const handleUpdate = async (formData) => {
    const result = await dispatch(updateBook({ id: editingBook.id, ...formData }));
    if (!result.error) {
      setEditingBook(null);
      setSuccessMsg("Book updated successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  if (status === "loading" && books.length === 0) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div>
      <ErrorBanner message={error} onDismiss={() => dispatch(clearError())} />
      <SuccessBanner message={successMsg} onDismiss={() => setSuccessMsg(null)} />

      {/* Edit Form (appears when editing) */}
      {editingBook && (
        <div className="edit-section">
          <div className="edit-header">
            <h3>Editing: {editingBook.title}</h3>
            <button className="cancel-btn" onClick={() => setEditingBook(null)}>Cancel</button>
          </div>
          <BookForm
            initialData={{
              title: editingBook.title,
              isbn: editingBook.isbn,
              publication_year: editingBook.publication_year,
              available_copies: editingBook.available_copies,
              author_id: editingBook.author_id,
            }}
            onSubmit={handleUpdate}
            submitLabel="Update Book"
          />
        </div>
      )}

      {/* Book List */}
      {books.length === 0 ? (
        <div className="empty-state">
          No books yet. Add one using the Create tab above.
        </div>
      ) : (
        <div className="book-list">
          {books.map((book) => (
            <div
              key={book.id}
              className={`book-card ${editingBook?.id === book.id ? "editing" : ""}`}
            >
              <div>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span className="book-title">{book.title}</span>
                  <span className="book-id-badge">ID: {book.id}</span>
                </div>
                <div className="book-meta">
                  <span>ISBN: {book.isbn}</span>
                  <span>Year: {book.publication_year}</span>
                  <span>Copies: {book.available_copies}</span>
                  <span>Author ID: {book.author_id}</span>
                </div>
              </div>
              <div className="book-actions">
                <button
                  className="action-btn edit"
                  onClick={() => setEditingBook(book)}
                >
                  Edit
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(book.id, book.title)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CREATE SCREEN
// ============================================================

function CreateScreen() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.books.error);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleCreate = async (formData) => {
    const result = await dispatch(createBook(formData));
    if (!result.error) {
      setSuccessMsg(`"${formData.title}" created successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div>
      <ErrorBanner message={error} onDismiss={() => dispatch(clearError())} />
      <SuccessBanner message={successMsg} onDismiss={() => setSuccessMsg(null)} />
      <div className="form-card">
        <BookForm onSubmit={handleCreate} submitLabel="Create Book" />
      </div>
      <p className="form-hint">
        Make sure the Author ID exists in your database before creating a book.
      </p>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

function App() {
  const [tab, setTab] = useState("home");
  const books = useSelector((state) => state.books.items);

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>
          <span className="accent">_</span>library
        </h1>
        <p>React + Redux Toolkit / FastAPI + MySQL</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "home" ? "active" : ""}`}
          onClick={() => setTab("home")}
        >
          Home ({books.length})
        </button>
        <button
          className={`tab-btn ${tab === "create" ? "active" : ""}`}
          onClick={() => setTab("create")}
        >
          + Create
        </button>
      </div>

      {/* Screens */}
      {tab === "home" && <HomeScreen />}
      {tab === "create" && <CreateScreen />}
    </div>
  );
}

export default App;
