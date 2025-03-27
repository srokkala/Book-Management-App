import React, { useState, useEffect, useCallback } from 'react';
import { setAuthToken, register, login, loadUser, getBooks, addBook, updateBook, deleteBook } from './api';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    publicationYear: ''
  });
  const [bookFormMode, setBookFormMode] = useState('add'); 
  const [bookFormVisible, setBookFormVisible] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    setToken(null);
    setBooks([]);
  }, []);

  const loadBooks = useCallback(async () => {
    if (!user) return; 
    
    try {
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }, [user]); 

  const loadUserData = useCallback(async () => {
    if (!token) return; 
    
    setIsLoading(true);
    try {
      setAuthToken(token);
      const userData = await loadUser();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
      setIsLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadUserData();
    }
  }, [token, loadUserData]);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user, loadBooks]);

  const handleAuthInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      let userData;
      if (authMode === 'register') {
        userData = await register(authForm.name, authForm.email, authForm.password);
      } else {
        userData = await login(authForm.email, authForm.password);
      }
      setToken(userData.token);
    } catch (error) {
      setAuthError(error.msg || 'Authentication failed');
      setIsLoading(false);
    }
  };

  const handleBookInputChange = (e) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bookFormMode === 'add') {
        const newBook = await addBook(bookForm);
        setBooks([...books, newBook]);
      } else {
        const updatedBook = await updateBook(currentBook._id, bookForm);
        setBooks(books.map(book => book._id === updatedBook._id ? updatedBook : book));
      }
      resetBookForm();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const editBook = (book) => {
    setCurrentBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description || '',
      publicationYear: book.publicationYear || ''
    });
    setBookFormMode('edit');
    setBookFormVisible(true);
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      publicationYear: ''
    });
    setCurrentBook(null);
    setBookFormMode('add');
    setBookFormVisible(false);
  };

  const renderAuthForm = () => (
    <div className="auth-container">
      <h2>{authMode === 'login' ? 'Login' : 'Register'}</h2>
      {authError && <div className="error">{authError}</div>}
      <form onSubmit={handleAuthSubmit}>
        {authMode === 'register' && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={authForm.name}
              onChange={handleAuthInputChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={authForm.email}
            onChange={handleAuthInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={authForm.password}
            onChange={handleAuthInputChange}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : (authMode === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      <p>
        {authMode === 'login'
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          className="link-btn"
          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        >
          {authMode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
      
      <div className="test-account">
        <p><strong>Test Account:</strong></p>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );

  const renderBookForm = () => (
    <div className="book-form">
      <h3>{bookFormMode === 'add' ? 'Add New Book' : 'Edit Book'}</h3>
      <form onSubmit={handleBookSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={bookForm.title}
            onChange={handleBookInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={bookForm.author}
            onChange={handleBookInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={bookForm.description}
            onChange={handleBookInputChange}
          />
        </div>
        <div className="form-group">
          <label>Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={bookForm.publicationYear}
            onChange={handleBookInputChange}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn">
            {bookFormMode === 'add' ? 'Add Book' : 'Update Book'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetBookForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderBookList = () => (
    <div className="book-list">
      <div className="book-list-header">
        <h3>My Books</h3>
        <button
          className="btn"
          onClick={() => {
            setBookFormMode('add');
            setBookFormVisible(true);
          }}
        >
          Add New Book
        </button>
      </div>
      {books.length === 0 ? (
        <p>No books in your collection. Add some!</p>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <div key={book._id} className="book-card">
              <h4>{book.title}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              {book.publicationYear && <p><strong>Year:</strong> {book.publicationYear}</p>}
              {book.description && <p className="book-description">{book.description}</p>}
              <div className="book-actions">
                <button className="btn btn-small" onClick={() => editBook(book)}>
                  Edit
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDeleteBook(book._id)}
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

  const renderApp = () => (
    <div className="app-container">
      <header>
        <h1>Book Management App</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button className="btn btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main>
        {bookFormVisible ? renderBookForm() : renderBookList()}
      </main>
    </div>
  );

  return (
    <div className="container">
      {isLoading && !user ? (
        <div className="loading">Loading...</div>
      ) : (
        user ? renderApp() : renderAuthForm()
      )}
    </div>
  );
}

export default App;