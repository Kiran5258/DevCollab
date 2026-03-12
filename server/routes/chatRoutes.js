const express = require('express');
const { getChats, sendChat, getChannels, createChannel } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/channels', protect, getChannels);
router.post('/channels', protect, createChannel);
router.route('/:channelId').get(protect, getChats).post(protect, sendChat);

module.exports = router;
