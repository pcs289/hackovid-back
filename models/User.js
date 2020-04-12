const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String },
    surname: { type: String },
    hashedPassword: { type: String },
    description: { type: String },
    contactInfo: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    avatarImg : { data: Buffer, contentType: String },
    offers: [ {type: Schema.ObjectId, ref: 'Offer'} ],
    requests: [ {type: Schema.ObjectId, ref: 'Request'} ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.index({location: "2dsphere"});

const User = mongoose.model("User", userSchema);

module.exports = {
    User
};
