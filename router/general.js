const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { PORT } = require('../index.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
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

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Assuming your server is running locally on port 5000
    const response = await axios.get(`http://localhost:${PORT}/`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    // Fallback or error response if the axios call fails
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Assuming your server is running locally on port 5000
    const response = await axios.get(`http://localhost:${PORT}/isbn/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details by ISBN", error: error.message });
  }
});
  
// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Assuming your server is running locally on port 5000
    const response = await axios.get(`http://localhost:${PORT}/author/${author}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details by author", error: error.message });
  }
});

// Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Assuming your server is running locally on port 5000
    const response = await axios.get(`http://localhost:${PORT}/title/${title}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  
  // Get the book reviews based on the provided ISBN
  const bookReviews = books[isbn].reviews;
  
  // Return the reviews as a neatly formatted JSON string
  return res.status(200).send(JSON.stringify(bookReviews, null, 4));
});

module.exports.general = public_users;
