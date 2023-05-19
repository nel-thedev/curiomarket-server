var express = require('express');
const Item = require('../models/Item');
const Store = require('../models/Store');
var router = express.Router();

router.get('/details/:id', async (req, res, next) => {
  try {
    const foundItem = await Item.findById(req.params.id).populate('comments');

    return res.json(foundItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// name: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   quantity: Number,
//   imageUrl: String,
//   value: Number,
//   isForSale: Boolean,

module.exports = router;
