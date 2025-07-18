const express = require('express');
const app = express();
app.use(express.json());

// Enhanced book database with more fields
let books = [
  { 
    id: 1, 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald", 
    isbn: "9780743273565",
    publishedYear: 1925,
    genre: "Classic",
    available: true,
    location: "Fiction A1",
    lastBorrowed: "2023-05-15"
  },
  { 
    id: 2, 
    title: "To Kill a Mockingbird", 
    author: "Harper Lee", 
    isbn: "9780061120084",
    publishedYear: 1960,
    genre: "Fiction",
    available: false,
    location: "Fiction B2",
    lastBorrowed: "2023-06-10",
    borrowedBy: "user123"
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    publishedYear: 2018,
    genre: "Self-Help",
    available: true,
    location: "Non-Fiction C3",
    lastBorrowed: "2023-04-22"
  }
];

// GET all books with filtering and pagination
app.get('/books', (req, res) => {
  // Filtering
  let filteredBooks = [...books];
  if (req.query.available) {
    filteredBooks = filteredBooks.filter(book => book.available === (req.query.available === 'true'));
  }
  if (req.query.genre) {
    filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === req.query.genre.toLowerCase());
  }
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm) || 
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const results = {
    total: filteredBooks.length,
    page,
    limit,
    totalPages: Math.ceil(filteredBooks.length / limit),
    data: filteredBooks.slice(startIndex, endIndex)
  };

  res.json(results);
});

// GET single book with more detailed response
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ 
      success: false,
      error: "Book not found",
      message: `No book exists with ID ${req.params.id}`
    });
  }
  
  const response = {
    success: true,
    data: book,
    links: {
      borrow: `/books/${book.id}/borrow`,
      return: `/books/${book.id}/return`
    }
  };
  
  res.json(response);
});

// POST new book with validation
app.post('/books', (req, res) => {
  const { title, author, isbn, publishedYear, genre, location } = req.body;
  
  // Validation
  if (!title || !author || !isbn) {
    return res.status(400).json({ 
      success: false,
      error: "Missing required fields",
      required: ["title", "author", "isbn"]
    });
  }
  
  // Check if ISBN already exists
  if (books.some(book => book.isbn === isbn)) {
    return res.status(409).json({
      success: false,
      error: "Book already exists",
      message: `A book with ISBN ${isbn} is already in the system`
    });
  }
  
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1,
    title,
    author,
    isbn,
    publishedYear: publishedYear || null,
    genre: genre || "Unknown",
    available: true,
    location: location || "Unassigned",
    lastBorrowed: null,
    addedDate: new Date().toISOString()
  };
  
  books.push(newBook);
  
  res.status(201).json({
    success: true,
    message: "Book added successfully",
    data: newBook
  });
});

// PUT update book with partial updates
app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: "Book not found" 
    });
  }
  
  const { title, author, isbn, publishedYear, genre, available, location } = req.body;
  const book = books[bookIndex];
  
  // Update only provided fields
  if (title) book.title = title;
  if (author) book.author = author;
  if (isbn) book.isbn = isbn;
  if (publishedYear) book.publishedYear = publishedYear;
  if (genre) book.genre = genre;
  if (available !== undefined) book.available = available;
  if (location) book.location = location;
  
  book.lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    message: "Book updated successfully",
    data: book
  });
});

// DELETE book with confirmation
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: "Book not found" 
    });
  }
  
  const [deletedBook] = books.splice(bookIndex, 1);
  
  res.json({
    success: true,
    message: "Book deleted successfully",
    data: deletedBook
  });
});

// Additional feature: Borrow a book
app.post('/books/:id/borrow', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ 
      success: false,
      error: "Book not found" 
    });
  }
  
  if (!book.available) {
    return res.status(400).json({
      success: false,
      error: "Book not available",
      message: `This book is currently borrowed by ${book.borrowedBy || 'another user'}`,
      expectedReturn: book.returnDate || "Unknown"
    });
  }
  
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ 
      success: false,
      error: "User ID required",
      message: "Please provide the user ID borrowing this book"
    });
  }
  
  book.available = false;
  book.borrowedBy = userId;
  book.borrowDate = new Date().toISOString();
  book.returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 2 weeks from now
  book.lastBorrowed = new Date().toISOString();
  
  res.json({
    success: true,
    message: "Book borrowed successfully",
    data: {
      bookId: book.id,
      title: book.title,
      borrowedBy: userId,
      borrowDate: book.borrowDate,
      returnDate: book.returnDate
    }
  });
});

// Additional feature: Return a book
app.post('/books/:id/return', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ 
      success: false,
      error: "Book not found" 
    });
  }
  
  if (book.available) {
    return res.status(400).json({
      success: false,
      error: "Book already available",
      message: "This book is not currently borrowed"
    });
  }
  
  book.available = true;
  const returnedBy = book.borrowedBy;
  delete book.borrowedBy;
  delete book.borrowDate;
  delete book.returnDate;
  book.lastBorrowed = new Date().toISOString();
  
  res.json({
    success: true,
    message: "Book returned successfully",
    data: {
      bookId: book.id,
      title: book.title,
      returnedBy,
      returnDate: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Something went wrong on our end"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `The requested endpoint ${req.method} ${req.path} does not exist`
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /books');
  console.log('  GET    /books/:id');
  console.log('  POST   /books');
  console.log('  PUT    /books/:id');
  console.log('  DELETE /books/:id');
  console.log('  POST   /books/:id/borrow');
  console.log('  POST   /books/:id/return');
});