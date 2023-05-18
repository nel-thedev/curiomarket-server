var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

// POST  /auth/signup
// ...
router.post('/signup', (req, res, next) => {
  const { email, password, fullName } = req.body;

  // Check if the email or password or name is provided as an empty string
  if (email === '' || password === '' || fullName === '') {
    res.status(400).json({ message: 'Provide email, password and name' });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: 'Email already in use.' });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, fullName });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      console.log(createdUser);
      const { email, _id, fullName } = createdUser;

      // Create a new object that doesn't expose the password
      const payload = {
        email,
        _id,
        fullName,
      };

      // Send a json response containing the user object

      const authToken = jwt.sign(payload, process.env.SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });

      console.log('Signup line 58', payload);

      res.status(201).json({ authToken: authToken, user: payload });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// POST  /auth/login
// ...
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === '' || password === '') {
    res.status(400).json({ message: 'Provide email and password.' });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .populate('visitedCountries')
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const {
          _id,
          email,
          fullName,
          location,
          age,
          profilePic,
          visitedCountries,
        } = foundUser;

        // Create an object that will be set as the token payload
        const payload = {
          _id,
          email,
          fullName,
          location,
          age,
          profilePic,
          visitedCountries,
        };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: 'HS256',
          expiresIn: '6h',
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken, user: payload });
      } else {
        res.status(401).json({ message: 'Unable to authenticate the user' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'Internal Server Error' }));
});

// GET  /auth/verify
// ...

router.get('/verify', (req, res, next) => {
  // <== CREATE NEW ROUTE

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log('req.user', req.user);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.user);
});

module.exports = router;

module.exports = router;
