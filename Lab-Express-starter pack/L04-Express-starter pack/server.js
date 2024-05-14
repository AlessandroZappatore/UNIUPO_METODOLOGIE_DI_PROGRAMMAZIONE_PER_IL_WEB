'use strict';
// import package
const express = require('express') ;
const morgan = require('morgan');
const Task = require('./task');
const TaskManager = require('./taskManager');
//validation middle-ware
const {check, validationResult} = require('express-validator');

const tm = new TaskManager();


// create application
const app = express();

//set port
const port = 3000;


// set-up logging
app.use(morgan('tiny'));

// process body content as JSON
app.use(express.json());



//get task with id
app.get('/tasks/:id', (req, res) => { 

    tm.getTask(req.params.id).then( (task) => {
        if(task.error){
            res.status(404).json(task);
        } else {
            res.json(task);
        }}).catch( (err) => {

           res.status(500).json({ 
               'errors': [{'param': 'Server', 'msg': err}],
            }); 
        } )
 
   
});

app.post('/tasks',  (req, res) => {
    //modificare inserendo validazione dei parametri
    const task = req.body;
    console.log(task);

    tm.addTask(task).then( (id) => {

        if (id.error) {

        }
        else{
            //modificare inserendo nell'header l'id della nuova risorsa
            // e.g., tasks/2
            res.status(200).end();

        }


    }).catch((err) =>{

        res.status(500).json({ 
            'errors': [{'param': 'Server', 'msg': err}],
         }); 

    });
    
    
})


// activate server
app.listen (port, () =>  console.log(`Server ready running at port ${port}` )) ;