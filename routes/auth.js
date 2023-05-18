var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

// POST  /auth/signup
// ...

router.post('/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ msg: 'provide email, password and name' });
    }
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      return res.status(400).json({ msg: 'email already exists' });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    delete user._doc.password;

    // Create a new object that doesn't expose the password

    // Send a json response containing the user object

    const authToken = jwt.sign({ payload: user }, process.env.SECRET, {
      algorithm: 'HS256',
      expiresIn: '6h',
    });

    console.log('Signup line 58', user);

    return res.status(201).json({ authToken: authToken, user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// POST  /auth/login
// ...
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === '' || password === '') {
      res.status(400).json({ message: 'Provide email and password.' });
      return;
    }

    const findUser = await User.findOne({ email });
    if (!findUser) {
      // If the user is not found, send an error response
      res.status(401).json({ message: 'User not found.' });
      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, findUser.password);

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
      } = findUser;

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
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
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
