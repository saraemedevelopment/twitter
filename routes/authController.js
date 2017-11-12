const express        = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//-----------SIGN UP-----------------------------//
//We need two different routes to create a new user:
//The GET route to show the form, and

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// The POST route to receive the parameters and save the data in the database.
// Get the data that the user has inserted in the form
authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  // Check out that he has correctly filled up both fields
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
//Check out if the username already exists in the database
  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

//If none of the conditions above happen, we can save the user
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        res.redirect("/login");
      }
    });
  });
});

//-----------LOG IN----------------------------//
authController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authController.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          // logged in
          // res.redirect("/tweets");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

authController.get("/", (req, res) => {
  res.redirect("/login");
});
//----------------------LOG OUT-------------------------
authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = authController;
