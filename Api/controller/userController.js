//imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//models
const User = require('../models/User');
const Message = require('../models/Message');
const { json } = require('body-parser');

const register = (req,res)=>{
    if(req.body.password < 4 || req.body.password > 30 ){
        res.status(200).json({error: "the password must be longer than 4 characters and less than 30 characters"});
    }

    bcrypt.hash(req.body.password, 10, (err, hash)=>{        
        var avatarPath = "";
        
        if(err){
            res.status(401).json(err);
        }      
        
        try{
            avatarPath = req.file.path;
        }catch(err){
            if(req.body.sexe === "male"){
                avatarPath = "uploads\\default_male.png";
            }else{
                avatarPath = "uploads\\default_female.png";
            }
        }

        User.find({pseudoName : req.body.pseudoName})
        .exec().then(response=>{
            if(response.length < 1){
                var user = new User({
                    avatar: avatarPath,
                    pseudoName: req.body.pseudoName,
                    password: hash,
                    sexe : req.body.sexe
                });
                
                user.save()
                .then(response=>{
                    res.status(201).json(response);
                })
                .catch(err=>{
                    res.status(401).json(err);
                });
            }else{
                res.status(422).json({
                    error: "Sorry there is another user with this pseudo"
                })
            }
        })
        .catch(err=>{
            res.status(422).json({err})
        })
    });
}


const login = (req, res)=>{
    
    User.findOne({pseudoName: req.body.pseudoName})
    .exec()
    .then(response=>{
        if(response){
            bcrypt.compare(req.body.password, response.password)
            .then(isauth=>{
                if(isauth){
                    jwt.sign({"pseudoName":response.pseudoName, "sexe": response.sexe, "_id": response._id, "avatar": response.avatar}, process.env.JWT_PRIVATE_KEY, (err, token)=>{
                        res.status(200).json({token});
                    });
                }else{
                    res.status(200).json({message: "your credentials are not correct"});
                }
            })
        }else{
            res.status(200).json({error : "your credentials are not correct"})
        }
    })
    .catch(err=>{
        res.status(401).json(err)
    })
}

const saveMessage = (req, res)=>{
    const msg = new Message({
        sender: req.body.sender,
        receiver: req.body.receiver,
        message: req.body.message
    });

    msg.save()
    .then(response=>{
        res.json(response);
    })
    .catch(err=>{
        res.status(503).json(err);
    })

}

const seenMessage = (req, res)=>{
    Message.updateMany({sender: req.body.sender, receiver: req.body.receiver, seen:false}, {seen: true},(err,response)=>{
        if(err) res.status(503).json(err);
        res.status(200).json(response);
    });
}


const loadMessage = (req, res)=>{
    Message.find({$or: [{sender: req.body.sender, receiver: req.body.receiver},{sender: req.body.receiver, receiver: req.body.sender}]})
    .limit(15)
    .sort({'createdAt': "desc"})
    .exec().then(response=>{
        res.status(200).json(response)
    })
    .catch(err=>console.log(err))
}

module.exports = {register, login, saveMessage, seenMessage, loadMessage};