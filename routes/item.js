var express = require('express');
const Item = require('../models/Item');
const Store = require('../models/Store');
const isAuthenticated = require('../middleware/isAuthenticated');
var router = express.Router();

router.get('/details/:id', async (req, res, next) => {
  try {
    const foundItem = await Item.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'author' },
    });
    return res.json(foundItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/edit-item', isAuthenticated, async (req, res, next) => {
  if (req.user._id === req.body.owner) {
    try {
      if (!name) {
        return res
          .status(400)
          .json({ msg: 'Please provide a name for the item' });
      }

      const updatedItem = await Item.findByIdAndUpdate(
        req.body._id,
        {
          name,
          description,
          quantity,
          imageUrl,
          value,
          isForSale,
        },
        {
          new: true,
        }
      );

      return res.json(updatedItem);
    } catch (error) {
      console.log(error);
      return res.json(error);
    }
  } else return res.json({ message: 'Not permitted.' });
});

router.get('/delete/:id', isAuthenticated, async (req, res, next) => {
  const deletedItem = await Item.findByIdAndDelete(req.params.id);
  console.log('deletedItem', deletedItem);

  const updatedStore = await Store.findByIdAndUpdate(
    deletedItem.store,
    {
      $pull: { items: deletedItem._id },
    },
    { new: true }
  );

  return res.json(deletedItem);
});

module.exports = router;
