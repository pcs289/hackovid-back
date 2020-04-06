const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const requestSchema = new Schema(
  {
    requester: { type: ObjectId, ref: 'User', required : true },
    preference: { type: ObjectId, ref: 'Preference', required : true },
    description: { type: String, default : null },
    status: { type: Number, default : 0  }, // Status --> 0 : Requested, 1 : Accepted, 2 : Denied, 3 : Done
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
