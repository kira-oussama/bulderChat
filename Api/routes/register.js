//imports
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const multer = require('multer');

//avatar upload
var store = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname )
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'  || file.mimetype=== 'image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const storage = multer({storage: store, limits: {fileSize: 1024*1024*5}, fileFilter});


//contorllers
const userController = require('./../controller/userController');

//middleware
const userAuth = require('./../middleware/userAuth');

//routes
router.post('/register', storage.single('avatarImg'), [
    check("pseudoName").isLength({min: 4, max:30}).withMessage("Username must be greater than 4 characters and less than 30 characters"),
    check("password").isLength({min: 4, max:30}).withMessage("Password must be greater than 4 characters and less than 30 characters"),
    check("sexe").isIn(["male", "female"]).withMessage("gender must be male or female")
], userController.register);


router.post('/login', userController.login);
router.post('/message', userAuth, userController.saveMessage);
router.post('/messageSeen', userAuth, userController.seenMessage);
router.post('/loadMsg', userAuth, userController.loadMessage);
router.get('/', userAuth, (req, res)=>{
    res.status(200).json({data : req.userData});
})



module.exports = router;