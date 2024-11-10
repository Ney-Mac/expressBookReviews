const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let existing_user = users.filter((user) => user.username === username);
    return !existing_user.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUser = users.filter((user) => (user.username === username && user.password === password));
    return validUser.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Bad request. Send all parameters.' });
    }

    if(!authenticatedUser(username, password)){
        return res.status(401).json({ message: "Invalid login. Check username and password." });
    }

    let accessToken = jwt.sign({
        data: password
    }, 'access-key', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if(!review) {
        return res.status(400).json({ message: "Review was not sended!" });
    }

    let book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not founded!" });
    }

    book.reviews[username] = review;
    res.status(200).json({ message: 'Review added!' });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    let book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not founded!" });
    }

    if(book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: 'Review deleted!' });
    }

    return res.status(404).json({ message: "There isn't review to delete." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
