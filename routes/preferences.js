const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { checkIfLoggedIn } = require("../middlewares/index");

/* GET list my preferences */
router.get("/", checkIfLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findById(req.session.currentUser._id);
    res.json(me.preferences);
  } catch (error) {
    next(error);
  }
});

/* POST create preference */
router.post("/create", checkIfLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findById(req.session.currentUser._id);
    me.preferences.push({
      "type": req.body.type,
      "dayOfWeek": req.body.dayOfWeek,
      "hourStart": req.body.hourStart,
      "hourEnd": req.body.hourEnd
    });
    me.markModified('preferences');
    const updatedMe = await me.save();
    res.json(updatedMe.preferences);
  } catch (error) {
    next(error);
  }
});

/* PUT update preference */
router.put("/:id", checkIfLoggedIn, async (req, res, next) => {
  try {
    let update = {};
    if(req.body.type) {
      update = Object.assign({}, update, { "type": req.body.type })
    }
    if(req.body.dayOfWeek) {
      update = Object.assign({}, update, { "dayOfWeek": req.body.dayOfWeek })
    }
    if(req.body.hourStart) {
      update = Object.assign({}, update, { "hourStart": req.body.hourStart })
    }
    if(req.body.hourEnd) {
      update = Object.assign({}, update, { "hourEnd": req.body.hourEnd })
    }
    const me = await User.findOneAndUpdate(
        {"_id": req.session.currentUser._id, "preferences._id": req.params.id},
        { 'preferences.$': update }).exec();
    if (me === null) {
      return res.status(404).json({code: "not-found"})
    }
    res.json({code: "success"});
  } catch (error) {
    next(error);
  }
});

/* DELETE delete a preference */
router.delete("/:id", checkIfLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOneAndUpdate(
        {"_id": req.session.currentUser._id, "preferences._id": req.params.id},
        {
          "$pull": { "preferences": { "_id": req.params.id} }
        }
    ).exec();
    if (me === null) {
      return res.status(404).json({code: "not-found"});
    }
    res.json({code: "success"});
  } catch (e) {
    next(e);
  }
});

module.exports = router;
