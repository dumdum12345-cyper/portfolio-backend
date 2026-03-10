const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

router.post('/setup', async (req, res) => {
  try {
    const existing = await Admin.findOne({});
    if (existing) return res.status(400).json({ error: 'Admin already exists.' });
    const { username, password } = req.body;
    const admin = await Admin.create({ username, password });
    res.status(201).json({ success: true, username: admin.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, username: admin.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    const unread = await Message.countDocuments({ read: false });
    res.json({ success: true, data: messages, unread });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/messages/:id/read', protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ error: 'Message not found.' });
    res.json({ success: true, data: msg });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/messages/:id', protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    res.json({ success: true, data: { totalMessages, unreadMessages } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
