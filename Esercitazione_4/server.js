"use strict";

const express = require("express");
const morgan = require("morgan");

const app = express();
const port = 3000;
app.use(morgan("tiny"));

app.get('/', (req, res) => {res.send('Hello world')});

app.listen(port, ()=> console.log('Server is up and running on port: ${port}'))
