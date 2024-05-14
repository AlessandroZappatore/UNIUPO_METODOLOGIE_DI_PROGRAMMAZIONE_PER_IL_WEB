'use strict';

const Task = require('./task');
const db = require('/.db');
   
     /**
      * converts a DB row into a Task
      * 
      */
   const createTask = function(dbTask) {
        const importantTask = (dbTask.important === 1) ? true : false;
        const privateTask = (dbTask.privateTask === 1) ? true : false; 
        const completedTask = (dbTask.completed === 1) ? true : false;
        const task =  new Task(dbTask.taskId, dbTask.description, privateTask, importantTask, dbTask.projectName, dbTask.deadline, completedTask);
        console.log(task);
        return task;
    }

    exports.getTasks = function(){
        return new Promise((resolve, reject)=>{
            const querySql = "SELECT * FROM Task";
            this.db.all(querySql, [], (err, rows) =>{
                if(err){
                    reject(err);
                }
                else{
                    if(rows === undefined){
                        resolve({error: 'No tasks found.'});
                    }
                    else{
                        resolve(this.createTask.rows);
                    }
                }
            });
        });
    }

    exports.getTask = function(id){
        return new Promise((resolve, reject) => {
            const querySql = "SELECT * FROM Task WHERE taskId=?";
            this.db.get(querySql, [id], (err, row) =>{
                if(err){
                    reject(err);
                }
                else{
                    if(row === undefined){
                        resolve({error: 'No task found'});
                    }
                    else{
                        resolve(this.createTask.row);
                    }
                }
            })
        })
    }

    exports.deleteTask = function(id){
        return new Promise((resolve, reject) =>{
            const querySql = "DELETE * FROM Task WHERE taskId=?";
            this.db.run(querySql, [id], (err) =>{
                if(err){
                    reject(err);
                }
                else{
                    resolve();
                }
            });
        });
    }

    exports.addTask = function(newTask){

        return new Promise((resolve, reject) => {
            const querySql = "INSERT INTO Task (description, important, privateTask, projectName, deadline, completed) VALUES (?)";

            this.db.run(querySql, [newTask['description'],  
            newTask['private'],
            newTask.important, 
            newTask.projectName, 
            newTask.deadline, 
            newTask.important], 
            (err) =>{
                if (err)
                  reject(err);
                else {
                   
                  resolve(this.lastID);  

                }
            });                        
        });
    }

    exports.setCompleted = function(id){
        return new Promise((resolve, reject) =>{
            const querySql = "UPDATE Task SET completed = 1 WHERE taskId=?";
            this.db.run(querySql, [id], (err) =>{
                if(err){
                    reject(err);
                }
                else{
                    if(this.change === 0){
                        resolve({error: 'Task not found'});
                    }
                    else{
                        resolve();
                    }
                }
            });
        })
    }
