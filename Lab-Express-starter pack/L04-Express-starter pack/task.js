'use strict';
const moment = require('moment');


class Task  {
   
 //   static counter = 1;

   
    constructor(id, descriptionText, privateTask=true, important=false, projectName, deadline, completed=false){

        if (id)
           this.id = id;
    //    else:
    //       this.id = Task.counter++;
        this.descriptionText = descriptionText;
        this.privateTask = privateTask;
        this.important = important;
        this.completed = completed;
        
        if (projectName)
            this.projectName = projectName;
     
        if (deadline)
           this.deadline = moment(deadline);
 

    }

   
}

module.exports = Task;
