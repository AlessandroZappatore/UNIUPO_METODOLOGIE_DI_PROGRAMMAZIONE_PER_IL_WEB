'use strict';

const Task = require('./task');
const sqlite = require('sqlite3').verbose();

class TaskManager{

    /**
     * @constructor
     */
    constructor() {
        
        this.DBSOURCE = './tasks.db';
        this.db =  new sqlite.Database(this.DBSOURCE, (err) => {
            if (err) {
                // cannot open database
                
                console.err(err.message);
                throw err;
            }
            else{
            
                console.log('Database opened correctly');
            }
        });
        
    }

   
     /**
      * converts a DB row into a Task
      * 
      */
    createTask(dbTask) {
        const importantTask = (dbTask.important === 1) ? true : false;
        const privateTask = (dbTask.privateTask === 1) ? true : false; 
        const completedTask = (dbTask.completed === 1) ? true : false;
        const task =  new Task(dbTask.taskId, dbTask.description, privateTask, importantTask, dbTask.projectName, dbTask.deadline, completedTask);
        console.log(task);
        return task;
    }

    getTask(id){

        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM Task WHERE taskId=?";

            this.db.get(sql, [id], (err, row) =>{
                if (err)
                  reject(err);
                else {
                    if (row === undefined)
                        resolve({error: 'Task not found.'});
                    else 
                        resolve (this.createTask(row));

                }



            });                        
        });
    }

    addTask(newTask){

        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO Task (Description) VALUES (?)";

            this.db.run(sql, [newTask.description, newTask['private']], (err) =>{
                if (err)
                  reject(err);
                else {
                   
                  resolve({});  

                }



            });                        
        });
    }

}



module.exports = TaskManager;