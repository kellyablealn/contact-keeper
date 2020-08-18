const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const router = express.Router();

const User = require("../models/User");

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/auth
// @desc        Auth user and get token
// @access      Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // Check if all the information has been given
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Get the email and password sent (from request)
    const { email, password } = req.body;

    try {
      // Try to get the user by its provided email
      let user = await User.findOne({ email });

      // No user found with the provided email
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Check if the password is correct
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate a valid token with the user id
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
