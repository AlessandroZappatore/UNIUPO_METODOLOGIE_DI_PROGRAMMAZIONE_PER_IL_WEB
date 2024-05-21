import Task from "./task.js";
import TaskManager from "./taskManager.js";
import Project from "./projects.js";
import Filter from "./filter.js";


class App {
    constructor(taskContainer, taskSideBarContainer, projectContainer,titleContainer) {
        // reference to the task list container (in HTML)
        this.taskContainer=taskContainer;
        // reference to the filter sidebar
        this.taskSideBarContainer = taskSideBarContainer; 
        // reference to the project sidebar
        this.projectContainer = projectContainer;
        // reference to the title of the list
        this.titleContainer = titleContainer;

        //reference to the task manager
        this.taskManager = new TaskManager();
        //reference to the initial list of tasks
        this.tasks = this.taskManager.tasks;

        //show all content
        this.showTasks(this.tasks);

        //init the filter functionality

        this.filter = new Filter(this.taskSideBarContainer, this.taskManager);
          
        // init the project functionality 
        
        this.projects = new Project(this.projectContainer, this.taskManager);
           
        //add event listener for filter class
        this.onFilterSelected = this.onFilterSelected.bind(this);
        document.addEventListener('filter-selected', this.onFilterSelected);

        // then move on to handle the addition of a new event

        // set up custom validation callback
        // -> if I insert a time for the deadline, then the date is required
        const timeInput = document.getElementById('form-deadline-time');
        const dateInput = document.getElementById('form-deadline-date');
        timeInput.addEventListener('input', function(){
            if(timeInput.value !== ''){
                // check date
                if(dateInput.value === ''){
                    dateInput.setCustomValidity('Data mancante, per favore, specificala');
                    dateInput.classList.add('invalid');
                }
            } else {
                dateInput.setCustomValidity('');
                dateInput.classList.remove('invalid');
            }
        });
        dateInput.addEventListener('input', function(event){
            if(dateInput.value !== '')
                dateInput.setCustomValidity('');
        });

        // set up form callback
        // recall: Arrow functions adopt the 'this' binding from the enclosing function scope
        document.getElementById('add-form').addEventListener('submit', event => {
            event.preventDefault();
            const addForm = document.getElementById('add-form');

            const description = addForm.elements['form-description'].value;

            let project = addForm.elements['form-project'].value;
            if(project === '')
                project = undefined;

            const important = addForm.elements['form-important'].checked;
            const privateTask = addForm.elements['form-private'].checked;
            
            const deadlineDate = addForm.elements['form-deadline-date'].value;
            const deadlineTime = addForm.elements['form-deadline-time'].value;
            
            let deadline = undefined;
            if(deadlineDate !== '' && deadlineTime !== '')
                deadline = deadlineDate + ' ' + deadlineTime;
            else if(deadlineDate !== '')
                deadline = deadlineDate;

     
            this.taskManager.addTask(description, important, privateTask, project, deadline);

            // refresh the user interface
            // assumptions: when a new task is added, all filters are disabled
            // alternative implementation: add the new task and re-apply the last filter
            this.clearTasks();
            this.showTasks(this.taskManager.tasks);

            // reset the selection sidebar to the first element for consistency
            this.taskSideBarContainer.querySelector('a.active').classList.remove('active');
            this.taskSideBarContainer.querySelector('a').classList.add('active');

            // update the project side bar
            this.projects.createAllProjects();
            // reset the selection sidebar to the first element for consistency
            if (this.projectContainer.querySelector('a.active'))
                this.projectContainer.querySelector('a.active').classList.remove('active');
           

            // reset the title
            this.titleContainer.innerText="Tutti";
               
            //reset the form and close the modal
            addForm.reset();
            document.getElementById('close-modal').click();
        });

     }

     
     //when a selection occurs, show the selected tasks
     onFilterSelected(event){
        //the selected tasks are passed with the custom generated event
        const tasks = event.detail.tasks;

        // first clear existing tasks (otherwise, the new tasks would be appended..)
        this.clearTasks();
        // then show the new ones
        this.showTasks(tasks);

              
        this.titleContainer.innerText = event.detail.title;
        

     }


     //show the list of tasks
    showTasks(tasks){

        // for each task
        for (const task of tasks) {
              // generate single task description enclosed in <li> tag
              const li = task.getHtmlNode();
              // append the current task description to the container!
              this.taskContainer.append(li);

        }
    }    

    //show the list of tasks
    clearTasks(){


        while (this.taskContainer.firstChild) {
            this.taskContainer.removeChild(this.taskContainer.firstChild);
        }
     
       //Alternatively:
       //this.taskContainer.innerHTML = '';
    }    
    


}

export default App;