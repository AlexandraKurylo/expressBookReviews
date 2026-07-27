const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username exists in the users array
  let filteredUsers = users.filter((user) => user.username === username);
  return filteredUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if username and password match the ones we have in records
  let matchedUsers = users.filter((user) => user.username === username && user.password === password);
  return matchedUsers.length > 0;
}

// only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in: Username and password are required" });
  }

  // Validate credentials
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Save the user credentials for the session
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({ message: "Customer successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  
  // Retrieve the username from the session authorization
  const username = req.session.authorization['username'];

  // Check if the review query parameter is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required as a query parameter" });
  }

  // Check if the book exists in the database
  if (books[isbn]) {
    let bookReviews = books[isbn].reviews;
    
    // Add or modify the review for the specific username
    bookReviews[username] = review;
    
    return res.status(200).json({ message: "The review was successfully added/updated." });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
