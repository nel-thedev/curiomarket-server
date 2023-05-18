const { model, Schema } = require('mongoose');

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    quantity: Number,
    imageUrl: String,
    value: Number,
    isForSale: Boolean,
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

module.exports = model('Item', itemSchema);
