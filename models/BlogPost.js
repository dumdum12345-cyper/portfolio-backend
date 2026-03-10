const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  tags: [{ type: String, trim: true }],
  published: { type: Boolean, default: false },
  coverImage: { type: String },
}, { timestamps: true });

blogSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('BlogPost', blogSchema);
