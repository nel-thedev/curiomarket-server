var express = require('express');
const Comment = require('../models/Comment');
const isAuthenticated = require('../middleware/isAuthenticated');
const Item = require('../models/Item');
var router = express.Router();

router.post('/create', isAuthenticated, async (req, res, next) => {
  const { content } = req.body;

  try {
    const newComment = await Comment.create({
      content,
      author: req.user._id,
    });
    // get it from params (would have to move this to item) or is there a way to get from elsewhere?
    await Item.findByIdAndUpdate(req.body.itemId, {
      $push: { comments: newComment._id },
    });

    return res.json(newComment);
  } catch (error) {
    return res.json(error);
  }
});

module.exports = router;
