const express = require("express");
const bcrypt = require("bcrypt");

const {
  checkUsernameAndPasswordNotEmpty,
  checkIfLoggedIn
} = require("../middlewares");

const User = require("../models/User");

const bcryptSalt = 10;

const router = express.Router();

/* GET current user data */
router.get("/me", (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser);
  } else {
    res.status(401).json({ code: "unauthorized" });
  }
});

/* POST user signup data */
router.post(
  "/signup",
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { name, surname, username, password } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      if (user) {
        return res.status(422).json({ code: "username-not-unique" });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        username,
        hashedPassword,
        name,
        surname
      });
      req.session.currentUser = newUser;
      return res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

/* POST user login data */
router.post(
  "/login",
  checkUsernameAndPasswordNotEmpty,
  async (req, res, next) => {
    const { username, password } = res.locals.auth;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ code: "not-found" });
      }
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        return res.json(user);
      }
      return res.status(404).json({ code: "not-found" });
    } catch (error) {
      next(error);
    }
  }
);

/* GET user logout */
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    return res.status(204).send();
  });
});

module.exports = router;
