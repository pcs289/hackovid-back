const express = require("express");
const router = express.Router();

const { User } = require("../models/User");

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
                },
                "preferences.dayOfWeek": dayOfWeek || 1
            });
            return res.status(200).json({ neighbors : myNeighbors })
        } catch (error) {
            next(error);
        }
    });


module.exports = router;
