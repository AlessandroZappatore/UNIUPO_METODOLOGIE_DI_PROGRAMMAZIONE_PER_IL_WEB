"use strict";
// import package
const express = require("express");
const morgan = require("morgan");
const Task = require("./task");
const tm = require("./dao");
//validation middle-ware
const { check, validationResult } = require("express-validator");

// create application
const app = express();

//set port
const port = 3000;

// set-up logging
app.use(morgan("tiny"));

// process body content as JSON
app.use(express.json());

app.get("/tasks", (req, res) => {
  tm.getTasks().then((tasks) => {
    if (tasks.error) {
      res.status(404).json(tasks);
    } else {
      res.json(tasks);
    }
  }).catch((err)=>{
    res.status(500).json({
        'errors': [{'param':'Server', 'msg':err}]
    });
});
});

app.get("/tasks/:id",(req, res) =>{
  tm.getTask(req.params.id).then((task) =>{
    if(task.error){
      res.status(404).json(task);
    } else{
      res.status(200).json(task);
    }
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param':'Server', 'msg':err}]
    });
  });
});

app.delete("/tasks/:id", (req, res) =>{
  const id = req.params.id;
  tm.deleteTask(req.params.id).then((result) =>{
      res.status(204).end();
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param':'Server', 'msg':err}]
    });
  });
})

app.post('/tasks', [
  check('description').isLength({min: 5}),
  check('description').notEmpty(),
  check('private').isBoolean(),
  check('important').isBoolean(),
  check('completed').isBoolean(),
  check('deadline').isDate(),
  check('projectName').isString()
], (req, res) =>{
  console.log(req);
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }

  tm.addTask(req.body).then((id) =>{
    res.status(201).header('Location', `/tasks/${id}`).end();
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param':'Server', 'msg':err}]
    });
  });
});

app.patch('/tasks/:id/completed', (req, res)=>{
  tm.setCompleted(req.params.id).then((err)=>{
    if(err){
      res.status(404).json(err);
    }
    else{
      res.status(204).end();
    }
  }).catch((err) =>{
    res.status(500).json({
      'errors': [{'param':'Server', 'msg':err}]
    });
  });
})
// activate server
app.listen(port, () => console.log(`Server ready running at port ${port}`));
