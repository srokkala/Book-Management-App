# Book Management Application

A full-stack application that allows users to manage their book collection with authentication and CRUD operations.

## Features

- User authentication (register/login)
- Add new books to the collection
- Edit existing book details
- Delete books from the collection
- View all books in the collection

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: In-memory data store (no external database required)
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/book-management-app.git
   cd book-management-app
   ```

2. Install server dependencies:
   ```
   npm install
   ```

3. Install client dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory (optional):
   ```
   JWT_SECRET=your_jwt_secret
   PORT=5001
   ```

5. Start the development server:
   ```
   npm run dev
   ```

   This will start both the backend server and the React frontend concurrently.

6. Access the application at `http://localhost:3000`

7. Use the test account to login:
   ```
   Email: test@example.com
   Password: password123
   ```
   
   Or register a new account.

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth - Get authenticated user

### Books
- GET /api/books - Get all books for authenticated user
- POST /api/books - Add a new book
- PUT /api/books/:id - Update a book
- DELETE /api/books/:id - Delete a book

## Application Structure

### Backend
- `server/index.js`: Main server setup and routes
- `server/db/inMemoryDB.js`: In-memory database implementation
- `server/Models/Book.js`: Book schema definition
- `server/Models/User.js`: User schema definition
- `server/Routes/books.js`: Book CRUD API endpoints
- `server/Routes/auth.js`: Authentication API endpoints
- `server/Middleware/auth.js`: Authentication middleware

### Frontend
- `client/src/App.js`: Main React component with auth and book management UI
- `client/src/api.js`: API service for communicating with the backend
- `client/src/index.css`: Application styles

## Authentication Implementation

The application uses a JSON Web Token (JWT) based authentication system:

1. User registration and login generate a JWT token
2. Token is stored in localStorage and used for authenticated API requests
3. Protected routes use the auth middleware to verify the token
4. User-specific data is retrieved based on the authenticated user ID

## Data Persistence

This application uses an in-memory database for simplicity and ease of setup:

- Data is stored in memory and seeded with sample data on server start
- Data will be reset when the server restarts
- No external database configuration is required

## Development Notes

- The server runs on port 5001 by default
- The React app runs on port 3000 and proxies API requests to the server
- CORS is configured to allow requests between the client and server