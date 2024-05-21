'use strict';
// import package
const express = require('express') ;
const morgan = require('morgan');
//validation middle-ware
const {check, validationResult} = require('express-validator');
const path = require('path');


// create application
const app = express();

//set port
const port = 3000;


// set-up logging
app.use(morgan('tiny'));

// process body content as JSON
app.use(express.json());


app.use(express.static('public'));//public è la cartella

/*
  REST API...

*/

// All requests will be served by our client-side app
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public/index.html'));
  });

// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;