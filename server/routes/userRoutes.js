const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
  toggleSaveProject,
  getUsers,
  deleteUser,
  deactivateAccount,
  getPlatformStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.get('/stats', protect, admin, getPlatformStats);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile).delete(protect, deactivateAccount);
router.put('/save-project/:projectId', protect, toggleSaveProject);
router.route('/:id').get(getUserById).delete(protect, admin, deleteUser);

module.exports = router;
