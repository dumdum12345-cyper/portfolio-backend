const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { sendContactNotification, sendAutoReply } = require('../config/mailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip,
    });

    try {
      await Promise.all([
        sendContactNotification({ name, email, message }),
        sendAutoReply({ name, email }),
      ]);
    } catch (emailErr) {
      console.error('Email error (non-fatal):', emailErr.message);
    }

    res.status(201).json({ success: true, message: "Message received! I'll get back to you soon." });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
