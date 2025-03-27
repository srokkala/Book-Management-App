const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const db = {
  users: [],
  books: [],
  
  async seed() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = {
      _id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date()
    };
    
    db.users.push(testUser);
    
    const sampleBooks = [
      {
        _id: 'book1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A classic novel about racial inequality in the American South.',
        publicationYear: 1960,
        user: 'user1',
        createdAt: new Date()
      },
      {
        _id: 'book2',
        title: '1984',
        author: 'George Orwell',
        description: 'A dystopian novel about totalitarianism and surveillance.',
        publicationYear: 1949,
        user: 'user1',
        createdAt: new Date()
      }
    ];
    
    db.books.push(...sampleBooks);
    
    console.log('Database seeded with test data');
  }
};

const User = {
  findOne: async (query) => {
    return db.users.find(user => {
      for (const key in query) {
        if (user[key] !== query[key]) return false;
      }
      return true;
    });
  },
  
  findById: async (id) => {
    const user = db.users.find(user => user._id === id);
    if (!user) return null;
    
    const userDoc = {
      ...user,
      select: function(fields) {
        return new Promise((resolve) => {
          if (fields === '-password') {
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          } else {
            resolve(user);
          }
        });
      }
    };
    
    return userDoc;
  },
  
  create: async (userData) => {
    const newUser = {
      _id: uuidv4(),
      ...userData,
      createdAt: new Date()
    };
    db.users.push(newUser);
    return newUser;
  }
};

const Book = {
  find: async (query) => {
    return db.books.filter(book => {
      for (const key in query) {
        if (book[key] !== query[key]) return false;
      }
      return true;
    });
  },
  
  findById: async (id) => {
    return db.books.find(book => book._id === id);
  },
  
  create: async (bookData) => {
    const newBook = {
      _id: uuidv4(),
      ...bookData,
      createdAt: new Date()
    };
    db.books.push(newBook);
    return newBook;
  },
  
  findByIdAndUpdate: async (id, update, options) => {
    const index = db.books.findIndex(book => book._id === id);
    if (index === -1) return null;
    
    const updatedBook = { 
      ...db.books[index], 
      ...update.$set,
      updatedAt: new Date()
    };
    
    db.books[index] = updatedBook;
    return updatedBook;
  },
  
  findByIdAndRemove: async (id) => {
    const index = db.books.findIndex(book => book._id === id);
    if (index === -1) return null;
    
    const removedBook = db.books[index];
    db.books.splice(index, 1);
    return removedBook;
  }
};

db.seed();

module.exports = { User, Book };