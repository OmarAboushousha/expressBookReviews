const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validUsernames = users.filter((user) => user.username === username);
  if (validUsernames.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let authUsers = users.filter((user) => user.username === username && user.password === password);
  if (authUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const validUsername = isValid(username);
  if (!username || !password) {
    return res.status(404).send("Error logging in");
  }
  if (!validUsername) {
    return res.status(404).send("Username does not exist");
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, "access", {expiresIn: 60 * 60});
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).send("Error logging in. Check username and password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const id = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.reviews;
  if (books[id]) {
    books[id].reviews[username] = review;
    res.status(200).send("Review added successfully");
  } else {
    res.status(404).send("Book not found");
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const id = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[id]) {
    if (books[id].reviews[username]) {
        delete books[id].reviews[username];
        res.status(200).send("Review deleted successfully");
    } else {
        res.status(404).send("You have no reviews for this book");
    }
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;