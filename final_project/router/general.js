const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        res.status(404).send("This username already exists");
    } else {
        users.push({"username": username, "password": password});
        res.status(200).send("User registered successfully. Now you can login");
    }
  } else {
    res.status(404).send("Cannot register user");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  if (id >= 1 && id <= Object.keys(books).length) {
    res.status(200).send(books[id]);
  } else {
    res.status(404).send("Book not found.");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let books_by_author = [];
  for (item = 1; item <= Object.keys(books).length; item++) {
    if (books[item].author === author) {
        books_by_author.push(books[item]);
    }
  }
  if (books_by_author.length) {
    res.status(200).send("Books by author " + author + ":\n" + JSON.stringify(books_by_author, null, 4))
  } else {
    res.status(404).send("Author not found.");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let books_by_title = [];
  for (item = 1; item <= Object.keys(books).length; item++) {
    if (books[item].title === title) {
        books_by_title.push(books[item]);
    }
  }
  if (books_by_title.length) {
    res.status(200).send("Books by title " + title + ":\n" + JSON.stringify(books_by_title, null, 4))
  } else {
    res.status(404).send("Book title not found.");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  if (id >= 1 && id <= Object.keys(books).length) {
    res.status(200).send("Reviews for " + books[id].title + ":\n" + JSON.stringify(books[id].reviews));
  } else {
    res.status(404).send("Book not found.");
  }
});

module.exports.general = public_users;
