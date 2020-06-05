//imports
require("dotenv/config");
const express = require('express');
const morgan = require("morgan"); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//logger
app.use(morgan('dev'));


//connect to mongodb

mongoose.connect(`mongodb+srv://kira:${process.env.ATLAS_DB_PW}@bulderchat-l1blm.gcp.mongodb.net/${process.env.ATLAS_DB_NAME}?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true });

//import routes
const registerRouter = require('./Api/routes/register');

//routers
app.use('/user', registerRouter);


module.exports = app;