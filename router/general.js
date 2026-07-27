const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { PORT } = require('../index.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  // Retrieve the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user already exists in the 'users' array
    const userExists = users.filter((user) => user.username === username);

    if (userExists.length > 0) {
      // Username already exists
      return res.status(409).json({ message: "Username already exists" });
    } else {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. You can now login." });
    }
  } else {
    // Username or password was not provided
    return res.status(400).json({ message: "Username and password are required" });
  }
});

// Get the book list available in the shop using async-await and Promises
public_users.get('/', async function (req, res) {
  try {
    // Create a promise to asynchronously fetch all books
    const getBooks = new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books not found"));
      }
    });
    
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN using async-await and Promises
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Create a promise to fetch book details by ISBN
    const getBookByIsbn = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    });

    const bookDetails = await getBookByIsbn;
    return res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Book not found by ISBN", error: error.message });
  }
});
  
// Get book details based on author using async-await and Promises
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Create a promise to filter books by author
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let booksByAuthor = [];
      let bookKeys = Object.keys(books);
      
      bookKeys.forEach((key) => {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      });

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("Author not found"));
      }
    });

    const result = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Author not found", error: error.message });
  }
});

// Get all books based on title using async-await and Promises
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Create a promise to filter books by title
    const getBooksByTitle = new Promise((resolve, reject) => {
      let booksByTitle = [];
      let bookKeys = Object.keys(books);
      
      bookKeys.keys = bookKeys.forEach((key) => {
        if (books[key].title === title) {
          booksByTitle.push(books[key]);
        }
      });

      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("Title not found"));
      }
    });

    const result = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Title not found", error: error.message });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Get the book reviews based on the provided ISBN
  const bookReviews = books[isbn].reviews;
  
  // Return the reviews as a neatly formatted JSON string
  return res.status(200).send(JSON.stringify(bookReviews, null, 4));
});

module.exports.general = public_users;