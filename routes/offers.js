const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require("../models/User");
const { Request } = require("../models/Request");
const {Offer} = require("../models/Offer");
const { checkIfLoggedIn } = require("../middlewares/index");

router.get('/all', checkIfLoggedIn, async (req, res) => {
  res.json(await Offer.find());
});

/* GET list my offers */
router.get("/list", checkIfLoggedIn, async (req, res, next) => {
  try {
    const myOffers = await Offer.find({creator: req.session.currentUser._id});
    const result = [];
    for(let offer of myOffers) {
      if (offer.status === 2) {
        const requests = await Request.find({offer: offer._id}).populate('requester', 'username avatarImg');
        result.push(Object.assign({}, offer._doc, { requests }));
      } else {
        result.push(Object.assign({}, offer._doc));
      }
    }
    res.json(result);
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
    const valid = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!valid) {
      return res.status(403).json({code: 'invalid-id'});
    }
    const offer = await Offer.findOne({_id: req.params.id}).populate('creator');
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
    offer.status = parseInt(status) >= 0 && parseInt(status) <= 3 ? parseInt(status) : 1 ;
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

  // Deletes all linked requests from requesters respectives requests' array
  const checkLinkedRequests = async (offerId) => {
    const offer = await Offer.findOne({_id: offerId});
    const requests = await Request.find({ offer }).populate('requester');
    for(let req of requests) {
      const requester = await User.findOne({_id: offer.requester._id});
      requester.requests = requester.requests.filter(re => re !== req.id);
      requester.save();
      req.delete();
    }
    offer.requests = offer.requests.filter(req => req !== id);
    if (offer.requests.length === 0) {
      offer.status = 1;
    }
    return offer.save();
  };

  try {
    const { id } = req.params;
    const me = await User.findOne({_id: req.session.currentUser._id});
    me.offers = me.offers.filter((offer) => offer !== id);
    await me.save();
    await checkLinkedRequests(id);
    const result = await Offer.findOneAndDelete({ _id: id });
    res.status(200).json({code: 'success', result});
  } catch (e) {
    next(e);
  }
});

module.exports = router;
