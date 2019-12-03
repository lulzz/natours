const express = require('express');

const {
   getAllUsers,
   createUser,
   getUser,
   updateUser,
   deleteUser,
   updateMe,
   deleteMe,
   getMe
} = require('../controllers/usersController');
const {
   signUp,
   login,
   protect,
   restrictTo,
   forgotPassword,
   resetPassword,
   updatePassword,
   logout
} = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// protect all routes after this middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);

// restrict all routes to admin after this middleware
router.use(restrictTo('admin'));

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
