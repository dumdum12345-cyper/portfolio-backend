const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  githubUrl: { type: String, trim: true },
  liveUrl: { type: String, trim: true },
  emoji: { type: String, default: '🚀' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
