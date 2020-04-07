const mongoose = require("mongoose");
const request = require("./Request");

const { Schema } = mongoose;
const { requestSchema } = request;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String },
    surname: { type: String },
    hashedPassword: { type: String },
    avatarImg: {
      type: String,
      default: 'https://res.cloudinary.com/dalhi9ynf/image/upload/v1573857720/mclovin_kprr0f.jpg'
    },
    location: { type: String },
    preferences: { type: [{
        type: { type: String, required: true },
        dayOfWeek: { type: String, required: true },
        hourStart: { type: String, required: true },
        hourEnd: { type: String, required: true }
    }]},
    requests: [ requestSchema ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    userSchema
};
