var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/profile/:id', async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.params.id).populate('stores');

    res.json(foundUser);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
