const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    let projects = await Project.find().populate('createdBy', 'name profileImage');
    
    // Check for trending sort
    if (req.query.sort === 'trending') {
      projects.sort((a, b) => {
        const aHype = (a.likes?.length || 0) + (a.comments?.length || 0);
        const bHype = (b.likes?.length || 0) + (b.comments?.length || 0);
        return bHype - aHype;
      });
    } else {
      projects.reverse(); // Default to newest
    }

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    let query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
      ? Project.findById(req.params.id) 
      : Project.findOne({ slug: req.params.id });

    const project = await query
      .populate('createdBy', 'name profileImage bio githubLink skills')
      .populate('comments.user', 'name profileImage')
      .populate('comments.replies.user', 'name profileImage');
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, tags, githubRepo, demoLink, images } = req.body;

    const project = await Project.create({
      title,
      description,
      tags,
      githubRepo,
      demoLink,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike project
// @route   PUT /api/projects/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const isLiked = project.likes.includes(req.user._id);

    if (isLiked) {
      project.likes = project.likes.filter((id) => id.toString() !== req.user._id.toString());
      if (user) {
        user.savedProjects = user.savedProjects.filter(id => id.toString() !== project._id.toString());
      }
    } else {
      project.likes.push(req.user._id);
      if (user && !user.savedProjects.some(id => id.toString() === project._id.toString())) {
        user.savedProjects.push(project._id);
      }
    }

    await project.save();
    if (user) await user.save();
    res.json(project.likes);
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to project
// @route   POST /api/projects/:id/comment
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const newComment = {
      user: req.user._id,
      text: req.body.text,
    };

    project.comments.unshift(newComment);
    await project.save();

    // Populate the newly added comment
    const updatedProject = await Project.findById(req.params.id).populate('comments.user', 'name profileImage');
    res.json(updatedProject.comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment from project
// @route   DELETE /api/projects/:id/comment/:commentId
// @access  Private
exports.deleteComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const comment = project.comments.find(c => c._id.toString() === req.params.commentId);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Only user who wrote the comment or project owner or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && 
        project.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    project.comments = project.comments.filter(c => c._id.toString() !== req.params.commentId);
    await project.save();

    res.json(project.comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike a comment
// @route   PUT /api/projects/:id/comment/:commentId/like
// @access  Private
exports.likeComment = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const comment = project.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const isLiked = comment.likes.includes(req.user._id);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await project.save();
    res.json(comment.likes);
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a comment
// @route   POST /api/projects/:id/comment/:commentId/reply
// @access  Private
exports.addCommentReply = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const comment = project.comments.id(req.params.commentId);
    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const reply = {
      user: req.user._id,
      text: req.body.text
    };

    comment.replies.push(reply);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('comments.replies.user', 'name profileImage');
    
    const updatedComment = updatedProject.comments.id(req.params.commentId);
    res.json(updatedComment.replies);
  } catch (error) {
    next(error);
  }
};
