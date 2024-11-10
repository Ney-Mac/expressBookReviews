const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).json({ message: "Bad request! Send all parameters." });
        return;
    }

    if (isValid(username)) {
        users.push({ username, password });
        return res.status(200).json({ message: "User successfully registered. Now you can login." });
    }

    return res.status(409).json({ message: "Cannot register!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooksPromise = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooksPromise.then(fetchedBooks => {
        res.status(200).json({
            message: 'Books fouded',
            data: fetchedBooks
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "Opps, cannot provide the books!" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    const fetchBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({
                message: "Book not founded!",
                code: 404
            });
        }
    });

    fetchBook.then(fetched_book => {
        res.status(200).json({ message: "Book founded.", data: fetched_book });
    }).catch(err => {
        res.status(err.code).json({ message: err.message });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    const fetchBooks = new Promise((resolve, reject) => {
        let fetchedBooks = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());

        if (fetchedBooks.length > 0) {
            resolve(fetchedBooks);
        } else {
            reject({
                code: 404,
                message: "Books not founded!"
            });
        }
    });

    fetchBooks.then(fetchedBooks => {
        res.status(200).json({ message: "Book founded.", data: fetchedBooks });
    }).catch(err => {
        res.status(err.code).json({ message: err.message });
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    const fetchBooks = new Promise((resolve, reject) => {
        let fetchedBook = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());

        if (fetchedBook.length > 0) {
            resolve(fetchedBook);
        } else {
            reject({
                code: 404,
                message: "Books not founded!"
            });
        }
    });

    fetchBooks.then(fetchedBooks => {
        res.status(200).json({ message: "Book founded.", data: fetchedBooks });
    }).catch(err => {
        res.status(err.code).json({ message: err.message });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    let book = books[isbn];
    if (book) {
        res.status(200).json({ message: `Book ${isbn} reviews`, data: book.reviews });
    } else {
        res.status(404).json({ message: "Book not founded!" });
    }
});

module.exports.general = public_users;
