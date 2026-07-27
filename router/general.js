const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { PORT } = require('../index.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const userExists = users.filter((user) => user.username === username);

    if (userExists.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered. You can now login." });
    }
  } else {
    return res.status(400).json({ message: "Username and password are required" });
  }
});

public_users.get('/', async function (req, res) {
  try {
    const portNum = process.env.PORT || 5000;
    const response = await axios.get(`http://localhost:${portNum}/`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    try {
      const response = await Promise.resolve({ data: books });
      return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    const response = await new Promise((resolve, reject) => {
      if (book) {
        resolve({ data: book });
      } else {
        reject(new Error("Book not found"));
      }
    });

    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Book not found by ISBN", error: error.message });
  }
});
  
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let booksByAuthor = [];
    let bookKeys = Object.keys(books);
    
    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });

    const response = await new Promise((resolve, reject) => {
      if (booksByAuthor.length > 0) {
        resolve({ data: booksByAuthor });
      } else {
        reject(new Error("Author not found"));
      }
    });

    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Author not found", error: error.message });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let booksByTitle = [];
    let bookKeys = Object.keys(books);
    
    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        booksByTitle.push(books[key]);
      }
    });

    const response = await new Promise((resolve, reject) => {
      if (booksByTitle.length > 0) {
        resolve({ data: booksByTitle });
      } else {
        reject(new Error("Title not found"));
      }
    });

    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(404).json({ message: "Title not found", error: error.message });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookReviews = books[isbn] ? books[isbn].reviews : {};
  return res.status(200).send(JSON.stringify(bookReviews, null, 4));
});

module.exports.general = public_users;