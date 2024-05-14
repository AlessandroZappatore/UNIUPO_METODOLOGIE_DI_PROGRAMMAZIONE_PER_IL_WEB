'use strict';
// import package
const express = require('express') ;
const morgan = require('morgan');
const Task = require('./task');
//validation middle-ware
const {check, validationResult} = require('express-validator');


// create application
const app = express();

//set port
const port = 3000;


// set-up logging
app.use(morgan('tiny'));

// process body content as JSON
app.use(express.json());

// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;