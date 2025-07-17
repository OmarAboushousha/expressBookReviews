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
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    const data = await Promise.resolve(books);
    res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    res.status(404).send("Error retrieving books");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  try {
    const data = await new Promise((resolve, reject) => {
      if (books[id]) {
        resolve(books[id]);
      } else {
        reject("Book not found");
      }
    });
    res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    res.status(404).send(err);
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  try{
    const books_by_author = await new Promise((resolve, reject) => {
      let result = [];
      for (item = 1; item <= Object.keys(books).length; item++) {
        if (books[item].author === author) {
          result.push(books[item]);
        }
      }
      if (result.length) {
        resolve(result);
      } else {
        reject("Author not found.")
      }
  });
  res.status(200).send("Books by author " + author + ":\n" + JSON.stringify(books_by_author, null, 4))
  } catch (err) {
    res.status(404).send(err);
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  try {
    const books_by_title = await new Promise((resolve, reject) => {
      let result = [];
      for (item = 1; item <= Object.keys(books).length; item++) {
        if (books[item].title === title) {
          result.push(books[item]);
        }
      }
      if (result.length) {
        resolve(result);
      } else {
        reject("Book title not found.");
      }
    });
    res.status(200).send("Books by title " + title + ":\n" + JSON.stringify(books_by_title, null, 4))
  } catch (err) {
    res.status(404).send(err);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const id = req.params.isbn;
  if (books[id]) {
    res.status(200).send("Reviews for " + books[id].title + ":\n" + JSON.stringify(books[id].reviews, null, 4));
  } else {
    res.status(404).send("Book not found.");
  }
});

module.exports.general = public_users;
