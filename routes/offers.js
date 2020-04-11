const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const {Offer} = require("../models/Offer");
const { checkIfLoggedIn } = require("../middlewares/index");

/* GET list my offers */
router.get("/list", checkIfLoggedIn, async (req, res, next) => {
  try {
    const myOffers = await Offer.find({creator: req.session.currentUser._id});
    res.json(myOffers);
  } catch (error) {
    next(error);
  }
});

/* POST create offer */
router.post("/create", checkIfLoggedIn, async (req, res, next) => {
  try {
    const {type, title, description, startDate, endDate} = req.body;
    const me = await User.findById(req.session.currentUser._id);
    const day = new Date(startDate).getDay();
    const dayOfWeek = day === 0 ? 7 : day;
    const offer = new Offer({
      creator: req.session.currentUser._id,
      status: 1,
      type,
      title,
      description,
      dayOfWeek,
      startDate,
      endDate
    });
    await offer.save();

    me.offers.push(offer._id);
    me.markModified('offers');
    await me.save();

    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
});

// Find an offer
router.get('/:id', checkIfLoggedIn, async (req, res, next) => {
  try {
    const offer = await Offer.findOne({_id: req.params.id});
    return res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
});

/* PUT update offer */
router.put("/:id", checkIfLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findById(req.session.currentUser._id);
    const offer = await Offer.findById(req.params.id);
    if (me === null || offer === null) {
      return res.status(404).json({code: "not-found"})
    }
    const {title, description, status, startDate, endDate} = req.body;
    if (title) {
      offer.title = title;
    }
    if (description) {
      offer.description = description;
    }
    offer.status = parseInt(status) >= 0 && parseInt(status) <= 3 ? parseInt(status) : 0 ;
    if (startDate && endDate) {
      const day = new Date(startDate).getDay();
      offer.dayOfWeek = day === 0 ? 7 : day;
      offer.startDate = startDate;
      offer.endDate = endDate;
    }
    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", checkIfLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const me = await User.findOne({_id: req.session.currentUser._id});
    me.offers = me.offers.filter((offer) => offer._id !== id);
    await me.save();
    const result = await Offer.findOneAndDelete({ _id: id });
    res.status(200).json({code: 'success', result});
  } catch (e) {
    next(e);
  }
});

module.exports = router;
