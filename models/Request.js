const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema(
  {
    requester: { type: ObjectId, ref: 'User', required : true }, // Service Consumer can alter status: {1,2} -> 3
    requested: { type: ObjectId, ref: 'User', required : true }, // Service Provider can alter status: 0 -> {1,2}
    preference: { type: Schema.ObjectId, ref: 'User.preferences', required: true }, // One of Requested's Preferences
    status: { type: Number, required: true, default: 0 }, // Status --> 0 : Requested, 1 : Accepted, 2 : Denied, 3 : Done
    description: { type: String, default : null }
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

