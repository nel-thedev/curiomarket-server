var express = require('express');
var router = express.Router();
const Store = require('../models/Store');
const User = require('../models/User');

router.get('/shop/:id', async (req, res, next) => {
  try {
    const foundStore = await Store.findById(req.params.id)
      .populate('items')
      .populate('ratings');

    res.json(foundStore);
  } catch (error) {
    console.log(error);
  }
});

router.post('/create', async (req, res, next) => {
  const { name, description } = req.body;
  try {
    if (!name || !description) {
      return res
        .status(400)
        .json({ msg: 'Please provide a name and description for the store' });
    }
    const findStore = await Store.findOne({ name });
    if (findStore) {
      return res.status(400).json({ msg: 'Store name already taken' });
    }

    const createdStore = await Store.create({
      name,
      description,
      owner,
    });

    User.findByIdAndUpdate(req.user._id, {
      $push: { stores: createdStore._id },
    });

    res.json(createdStore);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
