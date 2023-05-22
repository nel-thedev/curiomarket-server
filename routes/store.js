var express = require('express');
var router = express.Router();
const Store = require('../models/Store');
const User = require('../models/User');
const Item = require('../models/Item');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/all', async (req, res, next) => {
  try {
    const allStores = await Store.find().sort({ createdAt: -1 });
    return res.json(allStores);
  } catch (error) {
    console.log(error);
  }
});

router.get('/shop/:id', async (req, res, next) => {
  try {
    const foundStore = await Store.findById(req.params.id).populate('items');
    // .populate('ratings');

    return res.json(foundStore);
  } catch (error) {
    console.log(error);
  }
});

router.post('/create', isAuthenticated, async (req, res, next) => {
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

    await User.findByIdAndUpdate(req.user._id, {
      $push: { stores: createdStore._id },
    });

    return res.json(createdStore);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

router.post(
  '/shop/:id/create-item',
  isAuthenticated,
  async (req, res, next) => {
    const { name, description, quantity, imageUrl, value, isForSale } =
      req.body;

    if (req.user.stores.includes(req.params.id)) {
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
          store: req.params.id,
          owner: req.user._id,
        });

        await Store.findByIdAndUpdate(req.params.id, {
          $push: { items: createdItem._id },
        });

        return res.json(createdItem);
      } catch (error) {
        console.log(error);
        return res.json(error);
      }
    } else return res.json({ message: 'Not permitted.' });
  }
);

module.exports = router;
