import moment from "moment";

    class Task  {
   
    // static counter = 1;

   
    constructor(id, descriptionText, privateTask=true, important=false, projectName, deadline){
       
        this.id = Task.counter++;
        this.descriptionText = descriptionText;
        this.privateTask = privateTask;
        this.important = important;
        
        if (projectName)
            this.projectName = projectName;
     
        if (deadline)
           this.deadline = moment(deadline);
        

    }

    static from(json){
        const t = Object.assign(new Task(), json);
        t.descriptionText = json.descrption;
        delete t.descrption;
        if(t.deadline){
            t.deadline=moment.utc(t.deadline);
        }
        return t;
    }

    static to(json){
        const json = Object.assign(new Object(), json);
        json.descriptionText = json.descrption;
        delete json.descrption;
        if(json.deadline){
            json.deadline=json.deadline.format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
        else{
            json.deadline = '';
        }
        return json;
    }



    // returns the representation for the current task as a snippet of HTML code
    getHtmlNode(){
                
        const li = document.createElement('li');
        li.id = this.id;
        li.className='list-group-item';
        const outerDiv = document.createElement('div');
        outerDiv.className ='d-flex w-100 justify-content-between';

        const innerDiv = document.createElement('div');
        innerDiv.className='form-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.id = 'check-'+this.id;
        innerDiv.appendChild(checkbox);

  
        const descriptionText = document.createElement('label');
        descriptionText.className = 'form-check-label';
        descriptionText.htmlFor = checkbox.id;
        

        if(this.important) {
            const importantSpan = document.createElement('span');
            importantSpan.className = 'text-danger pr-1';
            importantSpan.innerText = '!!!';
            descriptionText.appendChild(importantSpan);
           
        }

        descriptionText.innerHTML += this.descriptionText;

        innerDiv.appendChild(descriptionText);

 
        if(this.projectName){
            const projectText = document.createElement('span');
            projectText.className = 'badge bg-primary mx-4';
            projectText.innerText = this.projectName;
            innerDiv.appendChild(projectText);
        }

     
        outerDiv.appendChild(innerDiv);

        if(this.deadline){
            const dateText = document.createElement('small');
            dateText.className = 'date';
            // print deadline - using the format function of Moment.js
            dateText.innerText = this.deadline.format('dddd, MMMM Do YYYY, h:mm:ss a'); 
            // mark expired tasks - using the isBefore function of Moment.js
            const now = moment();
            if(this.deadline.isBefore(now))
                dateText.classList.add('text-danger');
            
            outerDiv.appendChild(dateText);
        }   
        
        if(!this.privateTask){
            innerDiv.insertAdjacentHTML('afterend', `<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg> `);
        }

        li.appendChild(outerDiv);

        return li;

    }

   
}

export default Task;