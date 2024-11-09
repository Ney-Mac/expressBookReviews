const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = re.body;

    if (!username || !password) {
        res.status(401).json({ message: "Bad request! Send all parameters." });
        return;
    }
    
    let existing_user = users.filter((user) => user.username === username);
    if (existing_user) {
        res.status(409).json({ message: "Unable to complete request!" });
        return;
    }
    
    users.push({ username, password });
    res.status(200).json({ message: `The user ${username} has been added!` });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json({
        message: 'Books fouded',
        data: JSON.stringify(books)
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn } = req.params;

    let book = books[isbn];
    if (book) {
        res.status(200).json({ message: "Book founded.", data: book });
    } else {
        res.status(404).json({ message: "Book not founded!" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params;

    let book = Object.values(books).filter((book) => book.author === author);

    if (book.length > 0) {
        res.status(200).json({ message: "Book founded.", data: book });
    } else {
        res.status(404).json({ message: "Book not founded!" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;

    let book = Object.values(books).filter((book) => book.title === title);

    if (book.length > 0) {
        res.status(200).json({ message: "Book founded.", data: book });
    } else {
        res.status(404).json({ message: "Book not founded!" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;

    let book = books[isbn];
    if (book) {
        res.status(200).json({ message: "Book reviews", data: book.reviews });
    } else {
        res.status(404).json({ message: "Book not founded!" });
    }
});

module.exports.general = public_users;
