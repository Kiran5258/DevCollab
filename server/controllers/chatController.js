const Chat = require('../models/Chat');
const Channel = require('../models/Channel');

// @desc    Get all channels
// @route   GET /api/chats/channels
// @access  Private
exports.getChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find().populate('createdBy', 'name');
    
    // If no channels exist, create a default "General" channel
    if (channels.length === 0) {
      const general = await Channel.create({
        name: 'general',
        description: 'Global community hub for everyone.',
        createdBy: req.user._id
      });
      return res.json([general]);
    }
    
    res.json(channels);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new channel
// @route   POST /api/chats/channels
// @access  Private
exports.createChannel = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const channel = await Channel.create({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(channel);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Channel already exists');
    }
    next(error);
  }
};

// @desc    Get messages for a channel
// @route   GET /api/chats/:channelId
// @access  Private
exports.getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ channel: req.params.channelId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(chats.reverse());
  } catch (error) {
    next(error);
  }
};

// @desc    Send a chat message to a channel
// @route   POST /api/chats/:channelId
// @access  Private
exports.sendChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      channel: req.params.channelId,
      text: req.body.text,
    });

    const populatedChat = await Chat.findById(chat._id).populate('user', 'name profileImage');
    res.status(201).json(populatedChat);
  } catch (error) {
    next(error);
  }
};
