var express = require('express');
const User = require('../models/User');
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

module.exports = router;
