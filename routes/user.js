var express = require('express');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
var router = express.Router();

/* GET users listing. */
router.get('/profile/:id', async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id).populate('stores');

    return res.json(foundUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/update', isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });

    const { _id, email, fullName, profilePicture, stores } = updatedUser;

    const payload = {
      _id,
      email,
      fullName,
      profilePicture,
      stores,
    };

    const authToken = jwt.sign(payload, process.env.SECRET, {
      algorithm: 'HS256',
      expiresIn: '6h',
    });

    // Send the token as the response
    return res.status(200).json({ authToken: authToken, user: payload });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

router.get('/myprofile', isAuthenticated, async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.user.id).populate('stores');

    return res.json(foundUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
