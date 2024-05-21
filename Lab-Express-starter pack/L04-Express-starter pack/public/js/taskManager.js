//see https://jsdoc.app/about-getting-started.html for information about JDocs
import Task from './task.js';
class TaskManager{

    /**
     * @constructor
     */
    constructor() {

        this.tasks = [];
        //this.init();
        this.fetchTasks().then((x)=>{

        });
    }

    /**
     * build the initial task list
     */
    init() {

        this.tasks.push(
             new Task( 'Studiare REST API', true, true, "UPO", "06/12/2021" ), 
             new Task( 'Prenotare le vacanze estive', false, false, "Personal", "07/18/2021"),
             new Task( 'Comprare regali di Natale', false, false, "Personal", "12/24/2020")
        );

    }   

    async fetchTasks(){
        let response = await fetch('/api/tasks');
        const tasksJson = await response.json();
        console.log(response);

        if(response.ok){
            this.tasks = tasksJson.map((t) => {return Task.from(t);});
        }
        else{
            throw tasksJson;
        }
    }
    /**
     * add a new task
     * @param {string} descriptionText - the task description
     * @param {boolean} privateTask - flag which specifies if the task is private (true) or public (false)
     * @param {boolean} important - flag which specifies if the project is important
     * @param {string} projectName - name of the project the task belongs to ("" if none)
     * @param {string} deadline - deadline of the task ("" if none)
     */
    addTask(descriptionText, privateTask, important, projectName, deadline){

        this.tasks.push (new Task(descriptionText, privateTask, important, projectName, deadline));
    }

    /**
     * Get all the tasks flagged as private
     */
    filterPrivate(){

        return this.tasks.filter((t)  => {return t.privateTask});
       
        
    }

    /**
     * Get all the tasks flagged as important
     */
    filterImportant(){
        return this.tasks.filter((t)  => {return t.important});            
    }

    /**
     * Get all the tasks which deadline falls today
     */
    filterToday(){
        return this.tasks.filter ((t) => { 
        if(t.deadline)
            return this.isToday(t.deadline);
        else
            return false;
        });
    }

    /**
     * Get all the tasks which deadline falls in the next seven days
     */
    filterNextWeek(){
        return this.tasks.filter ((t) => {
        if(t.deadline)
            return this.isNextWeek(t.deadline);
        else
            return false;
        });
    }
    
    /**
     * Get all the tasks that are not private
     */
    filterShared(){
        return this.tasks.filter((t)  => {return !t.privateTask});             
    }

   
    /**
     * Get all the projects
     */
     get projects() {

        const projects = [];
        for(const task of this.tasks){
            if(task.projectName && !projects.includes(task.projectName))
                projects.push(task.projectName);
        }

        return projects;
        //Alternative
        //return [...new Set(this.tasks.map(task => task.project))];
    }

    /**
     * Get all the tasks of a given project
     * 
     * @param {*} project the given project
     */
    getByProject(project) {
        return this.tasks.filter((el) => {
            return el.projectName === project;
        });
    }


    /**
     * Function to check if a date is today. Returns true if the date is today, false otherwise.
     * @param {*} date a Moment js date to be checked
     */
       isToday(date) {
        return date.isSame(moment(), 'day');
    }

    /**
     * Function to check if a date is in the next week. Returns true if the date is in the next week, false otherwise.
     * @param {*} date a Moment js Date to be checked
     */
    isNextWeek(date) {
        const nextWeek = moment().add(1, 'weeks');
        const tomorrow = moment().add(1, 'days');
        return date.isAfter(tomorrow) && date.isBefore(nextWeek);
    }

}


export default TaskManager;
