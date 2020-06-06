//imports
const express = require('express');
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
router.post('/register', storage.single('avatarImg'), userController.register);
router.post('/login', userController.login);
router.get('/', userAuth, (req, res)=>{
    res.status(200).json({
        "port": process.env.PORT,
        "ATLAS_DB_PW": process.env.ATLAS_DB_PW,
        "ATLAS_DB_NAME": process.env.ATLAS_DB_NAME,
        "JWT_PRIVATE_KEY": process.env.JWT_PRIVATE_KEY,
    });
})



module.exports = router;