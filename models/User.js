const { model, Schema } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    profilePicture: String,
    stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

module.exports = model('User', userSchema);
