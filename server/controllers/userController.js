const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get user profile (Current logged in user)
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedProjects',
      populate: { path: 'createdBy', select: 'name profileImage' }
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.githubLink = req.body.githubLink || user.githubLink;
      user.socialLinks = req.body.socialLinks || user.socialLinks;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.isAvailableForHire = req.body.isAvailableForHire !== undefined ? req.body.isAvailableForHire : user.isAvailableForHire;
      user.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : user.isPublic;
      user.notifications = req.body.notifications || user.notifications;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get public developer profile
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    const projects = await Project.find({ createdBy: req.params.id });

    if (user) {
      res.json({ user, projects });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Unsave project
// @route   PUT /api/users/save-project/:projectId
// @access  Private
exports.toggleSaveProject = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const projectId = req.params.projectId;

    const index = user.savedProjects.indexOf(projectId);

    if (index > -1) {
      user.savedProjects.splice(index, 1);
    } else {
      user.savedProjects.push(projectId);
    }

    await user.save();
    res.json(user.savedProjects);
  } catch (error) {
    next(error);
  }
};

// ADMIN FUNCTIONS

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getPlatformStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    
    // Simple stats for demonstration
    const stats = {
      users: userCount,
      projects: projectCount,
      activeProjects: await Project.countDocuments({ status: 'active' }),
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate / Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Optional: Delete user's projects or mark them as orphaned
    await Project.deleteMany({ createdBy: user._id });
    
    await user.deleteOne();

    res.json({ success: true, message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
