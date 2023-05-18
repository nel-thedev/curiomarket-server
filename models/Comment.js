const { model, Schema } = require('mongoose');

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

module.exports = model('Comment', commentSchema);
