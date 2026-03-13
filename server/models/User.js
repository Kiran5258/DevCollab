const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: function() {
      return !this.firebaseId && !this.googleId && !this.githubId;
    },
    minlength: 6,
    select: false,
  },
  firebaseId: String,
  googleId: String,
  githubId: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  profileImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1622550000/default_avatar.png',
  },
  skills: [String],
  bio: String,
  githubLink: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String,
  },
  location: {
    type: String,
    default: '',
  },
  isAvailableForHire: {
    type: Boolean,
    default: false,
  },
  savedProjects: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
  }],
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
