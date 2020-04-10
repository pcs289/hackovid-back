const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema(
  {
    requester: { type: ObjectId, ref: 'User', required : true },
    offer: { type: Schema.ObjectId, ref: 'Offer', required: true },
    status: { type: Number, required: true, default: 0 }, // 0: Requested, 1: Accepted, 2: Denied, 3: Cancelled
    comments: { type: String, default : null }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = {
    Request
};

