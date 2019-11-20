const express = require('express');

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
} = require('../controllers/usersController');
const {
    signUp,
    loginIn,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', loginIn);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(protect, restrictTo('admin'), deleteUser);

module.exports = router;
