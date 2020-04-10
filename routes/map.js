const express = require("express");
const router = express.Router();

const { User } = require("../models/User");
const { Offer } = require("../models/Offer");
const { checkIfLoggedIn } = require("../middlewares/index");

router.put(
  "/location", 
  checkIfLoggedIn, 
  async (req, res, next) => {
    try {
      const { longitude, latitude } = req.body;
      const location = { type: 'Point', coordinates: [longitude, latitude] }
      await User.findByIdAndUpdate({ _id :  req.session.currentUser._id}, { location : location })
      res.status(200).json({ code : "success" })
    } catch (error) {
      next(error);
    }
});

const toRad = deg => deg * Math.PI / 180;
const distance = (pos1, pos2) => {
  const x1 = pos2.lat-pos1.lat;
  const dLat = toRad(x1);
  const x2 = pos2.lon-pos1.lon;
  const dLon = toRad(x1);
  const a = Math.sin(dLat/2) ** 2 + Math.sin(dLon/2) ** 2
};

router.post(
    "/neighbors",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { radius, dayOfWeek } = req.body;
            const myNeighbors = await User.find({
                "location": {
                    "$near": {
                        "$geometry": req.session.currentUser.location,
                        "$maxDistance": radius || 1000
                    }
                }
            });
            const offers = [];
            for (let neig of myNeighbors) {
                for (let offerId of neig.offers) {
                    const offer = await Offer.findOne({ _id: offerId });
                    if (offer && offer.dayOfWeek === parseInt(dayOfWeek)) {
                        offers.push(Object.assign({}, offer._doc, { proximity: , location: neig.location }));
                    }
                }
            }
            return res.status(200).json({offers});
        } catch (error) {
            next(error);
        }
    });


module.exports = router;
