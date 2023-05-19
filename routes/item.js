var express = require('express');
const Item = require('../models/Item');
const Store = require('../models/Store');
var router = express.Router();

router.get('/details/:id', async (req, res, next) => {
  try {
    const foundItem = await Item.findById(req.params.id).populate('comments');

    res.json(foundItem);
  } catch (error) {
    console.log(error);
  }
});

router.post('/create', async (req, res, next) => {
  const { name, description, quantity, imageUrl, value, isForSale } = req.body;
  try {
    if (!name) {
      return res
        .status(400)
        .json({ msg: 'Please provide a name for the item' });
    }

    const createdItem = await Item.create({
      name,
      description,
      quantity,
      imageUrl,
      value,
      isForSale,
      store, //HELP MAYBE PUT THIS IN STORE ROUTE???????
    });

    Store.findByIdAndUpdate(createdItem.store, {
      $push: { items: createdItem._id },
    });

    res.json(createdItem);
  } catch (error) {}
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
