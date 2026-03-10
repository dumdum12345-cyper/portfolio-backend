const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, order: 1 });
    res.json({ success: true, data: projects });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
