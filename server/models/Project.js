const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  tags: {
    type: [String],
    required: true,
  },
  githubRepo: {
    type: String,
    required: [true, 'Please add a GitHub repository link'],
  },
  demoLink: String,
  images: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
    replies: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    }
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  },
  slug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

// Create project slug from the title
projectSchema.pre('save', function(next) {
  if (!this.isModified('title') && this.slug) {
    next();
    return;
  }
  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
  next();
});

module.exports = mongoose.model('Project', projectSchema);
