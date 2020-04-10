const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const offerSchema = new Schema(
    {
        creator: { type: ObjectId, ref: 'User', required : true },
        status: { type: Number, required: true, default: 0 }, // 0: Inactive, 1: Active, 2: Pending Answer, 3: Done, 4: Past
        type: { type: Number, required: true, default: 3 }, // 0: Aliments, 1: Tallers, 2: Salut, 3: Altres
        title: { type: String, required: true },
        description: { type: String, required: true },
        dayOfWeek: { type: Number, required: true }, // Format 1-7, used to search
        startDate: { type: String, required: true },
        endDate: { type: String, required: true }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

const Offer = mongoose.model("Offer", offerSchema);

module.exports = {
    Offer
};

