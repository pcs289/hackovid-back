const express = require("express");
const { Request } = require("../models/Request");
const { User } = require("../models/User");
const {Offer} = require("../models/Offer");
const { checkIfLoggedIn } = require("../middlewares");

const router = express.Router();

router.get('/all', checkIfLoggedIn, async (req, res) => {
    res.json(await Request.find());
});

router.get(
    "/list",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const requests = await Request.find({ requester : req.session.currentUser._id }).populate('offer');
            res.status(200).json(requests)
        } catch(error) {
            next(error);
        }
    }
);

/* POST create a new request to 'offerId' */
router.post(
    "/create",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { offerId, comments } = req.body;

            const requester = await User.findOne({ _id : req.session.currentUser._id });
            const offer = await Offer.findOneAndUpdate({ _id : offerId }, { status: 2});
            if (requester === null || offer === null) {
                return res.status(404).json({code: "not-found"})
            }
            await offer.save();
            let request = new Request({
                requester,
                offer,
                status: 0,
                comments
            });
            request = await request.save();

            // Add to requester's requests array
            requester.requests.push(request._id);
            requester.markModified('requests');
            await requester.save();

            res.status(200).json(request)
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/status/:statusCode",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestId } = req.body;
            const { statusCode } = req.params;
            const code = parseInt(statusCode) >= 0 && parseInt(statusCode) <= 3 ? parseInt(statusCode) : 0 ;
            if (code === 2) {
                // TODO: When accepting a request, the rest of candidates to the same offer, should be marked as cancelled
            } else if (code === 3) {
                // TODO: When denying a request
            }
            const request = await Request.findOne({ _id: requestId });
            request.status = code;
            const updatedRequest = await request.save();
            res.status(200).json(updatedRequest)
        } catch(error) {
            next(error);
        }
    }
);

router.put(
    "/comment",
    checkIfLoggedIn,
    async (req, res, next) => {
        try {
            const { requestId, comments } = req.body;
            const request = await Request.findOne({ _id : requestId }).populate("requester");
            if (request.requester._id != req.session.currentUser._id) {
                return res.status(403).json({ code : "forbidden" })
            }
            request.comments = comments;
            const updatedRequest = await request.save();
            res.status(200).json(updatedRequest)
        } catch(error) {
            next(error);
        }
    }
);

checkIfSomeOfferLastRequest =

router.delete("/:id", checkIfLoggedIn, async (req, res, next) => {

    const checkIfLastRequest = async (reqId) => {
        const request = await Request.findOne({_id: reqId});
        const offer = await Offer.findOne({_id: request.offer._id});
        offer.requests = offer.requests.filter(req => req !== id);
        if (offer.requests.length === 0) {
            offer.status = 1;
        }
        return offer.save();
    };

    try {
        const { id } = req.params;
        const me = await User.findOne({_id: id});
        me.requests = me.requests.filter((request) => request !== id);
        await me.save();
        await checkIfLastRequest(id);
        const result = await Request.findOneAndDelete({ _id: id });
        res.status(200).json({code: 'success', result});
    } catch (e) {
        next(e);
    }
});


module.exports = router;
