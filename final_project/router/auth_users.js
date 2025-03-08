const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
   let userswithsamename = users.filter((user) => {
    return user.username === username
});

if(userswithsamename.length > 0){
    return true;
}else{
    return false;
}
}


const authenticatedUser = (username, password) => {
  
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
 
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message : "Error Logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data : password}, 'access', {expiresIn : 6000 * 6000});
    req.session.authorization = { accessToken, username }
    return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }


  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;
  let state = false;
  

  if(!review){
    res.status(400).json({error : "Review text is required."});
  }

  if(isbn < Object.keys(books).length && isbn > 0 && isbn != null){
    
    const reviews = books[isbn].reviews;

    for(let id in reviews){
        if(id.username === req.session.authorization.username){
            state = true;
            id.review = review;
        }
    }

    if(!state){
          books[isbn].reviews.push({"username": req.session.authorization.username, "review" : review});
    }

    res.status(200).json({message : "review added successfully"});
  

  }else{
    res.status(300).json({message: "isbn error"});
  }

  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
