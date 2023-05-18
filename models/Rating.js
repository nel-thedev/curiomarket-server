const { model, Schema } = require('mongoose');

const ratingSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

module.exports = model('Rating', ratingSchema);
