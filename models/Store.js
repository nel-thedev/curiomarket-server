const { model, Schema } = require('mongoose');

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

module.exports = model('Store', storeSchema);
