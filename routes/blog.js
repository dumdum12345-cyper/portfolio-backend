const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).select('-content').sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ success: true, data: post });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json({ success: true, data: post });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
