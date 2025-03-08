const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if(!username &&  !password){
    res.status(400).json({message: "password and username required"});
  }

  if(!username) {
    res.status(400).json({message: " username required"});
  }

  if(!password){
    res.status(400).json({message: "password required"});
  }

  if(doesExist(username)){
    res.status(400).json({message: "login error"});
  }

  users.push({"username" : username, "password": password});
  res.status(200).json({message: "User registered successfully"});
  
/*
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}

// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});

*/
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {

    try{
        const booksData = await getBooks();
        res.end(JSON.stringify(books, null, 4));
    }catch(error){
        res.status(500).json({error: "Failed to fetch books"})
    }
  
});

async function getBooks(){
    return new Promise((resolve) => {
        setTimeout(() => resolve(books), 100);
    })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;
  if(isbn < Object.keys(books).length && isbn > 0 && isbn != null){
    res.end(JSON.stringify(books[isbn], null, 4));
  }else{
    res.status(300).json({message: "isbn error"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  let count = 0;
  const keys = Object.keys(books); 

    if(author){
        for (let i = 0; i < keys.length; i++) {
            let book = books[keys[i]]; 
            if (book.author.toLowerCase() === author.toLowerCase())
            {
                output = book.author;
                count = i;
                break;
            }
    }

    res.end(JSON.stringify(books[count + 1], null, 4));

    }else{
        res.status(300).json({message : "author error"});
    }

  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

   const title = req.params.title;
  let count = 0;
  const keys = Object.keys(books); 

    if(title){
        for (let i = 0; i < keys.length; i++) {
            let book = books[keys[i]]; 
            if (book.title.toLowerCase() === title.toLowerCase())
            {
                output = book.title;
                count = i;
                break;
            }
    }

    res.end(JSON.stringify(books[count + 1], null, 4));

    }else{
        res.status(300).json({message : "title error"});
    }
  
});



public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
  if(isbn < Object.keys(books).length && isbn > 0 && isbn != null){
    res.end(JSON.stringify(books[isbn].reviews, null, 4));
  }else{
    res.status(300).json({message: "isbn error"});
  }
 
});

module.exports.general = public_users;
