const express = require('express');
const router = express.Router();
const { Book } = require('../db/inMemoryDB'); 
const auth = require('../middleware/auth');

// Get all books for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new book
router.post('/', auth, async (req, res) => {
  const { title, author, description, publicationYear } = req.body;

  try {
    const newBook = await Book.create({
      title,
      author,
      description,
      publicationYear,
      user: req.user.id
    });

    res.json(newBook);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a book
router.put('/:id', auth, async (req, res) => {
  const { title, author, description, publicationYear } = req.body;

  const bookFields = {};
  if (title) bookFields.title = title;
  if (author) bookFields.author = author;
  if (description) bookFields.description = description;
  if (publicationYear) bookFields.publicationYear = publicationYear;

  try {
    let book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.user !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: bookFields },
      { new: true }
    );

    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a book
router.delete('/:id', auth, async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ msg: 'Book not found' });

    if (book.user !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Book.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;