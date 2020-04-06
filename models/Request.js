const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema(
  {
    requester: { type: ObjectId, ref: 'User' },
    preference: { type: ObjectId, ref: 'Preference' },
    description: { type: String },
    status: { type: Number }, // Status --> 0 : Requested, 1 : Accepted, 2 : Denied, 3 : Done
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
    Request,
    requestSchema
};
