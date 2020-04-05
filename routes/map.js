const express = require("express");
const router = express.Router();

const { checkIfLoggedIn } = require("../middlewares/index");

/* GET map */
router.get("/", checkIfLoggedIn, async (req, res, next) => {
  try {
    res.json({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
