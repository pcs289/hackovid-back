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
const R = 6371;
const distance = (pos1, pos2) => {
  const x1 = pos2.lat-pos1.lat;
  const dLat = toRad(x1);
  const x2 = pos2.lon-pos1.lon;
  const dLon = toRad(x1);
  const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

router.post(
    "/neighbors",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { radius, dayOfWeek } = req.body;
            const myNeighbors = await User.find({
                "_id": { "$ne": req.session.currentUser._id },
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
                        const loc = req.session.currentUser.location;
                        const proximity = distance({lat: neig.location.coordinates[1], lon: neig.location.coordinates[0]}, {lat: loc.coordinates[1], lon: loc.coordinates[0]});
                        offers.push(Object.assign({}, offer._doc, { proximity, location: neig.location, username: neig.username }));
                    }
                }
            }
            return res.status(200).json({offers});
        } catch (error) {
            next(error);
        }
    });


module.exports = router;
