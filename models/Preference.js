const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const preferenceSchema = new Schema(
  {
    type: { type: String, required: true },
    dayOfWeek: { type: String, required: true },
    hourStart: { type: String, required: true },
    hourEnd: { type: String, required: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Preference = mongoose.model("Preference", preferenceSchema);

module.exports = Preference;