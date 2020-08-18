const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check");

const User = require("../models/User");
const Contact = require("../models/Contact");

const router = express.Router();

// @route       GET api/contacts
// @desc        Get all users contacts
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/contacts
// @desc        Add nem contact
// @access      Private
router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    // Check if all the information has been given
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Get the contact information sent (from request)
    const { name, email, phone, type, birthday } = req.body;

    try {
      const contact = new Contact({
        name,
        email,
        phone,
        type,
        birthday,
        user: req.user.id,
      });

      const newContact = await contact.save();
      res.send(newContact);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       PUT api/contacts
// @desc        Update contact
// @access      Private
router.put("/:id", auth, async (req, res) => {
  // Get the contact information sent (from request)
  const { name, email, phone, type, birthday } = req.body;
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;
  if (birthday) contactFields.birthday = birthday;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ msg: "Contact not found" });
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(contact.id, {
      $set: contactFields,
      new: true,
    });

    res.send(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route       DELETE api/contacts
// @desc        Delete contact
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404).json({ msg: "Contact not found" });
    }

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(contact.id);

    res.send({ msg: "Contact removed" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
