"use strict";
const readline = require("readline-sync");
const { format, isValid } = require("date-fns");

function printMenu(){
    console.log("1. Inserire un nuovo task");
    console.log("2. Rimuovere un task");
    console.log("3. Mostrare tutti i task esistenti, in ordine alfabetico");
    console.log("4. Chiudere il programma");
}

function addTask(tasks){
    let descrizione=readline.question("Inserire la descrizione: ");
    while(descrizione=="") descrizione=readline.question("Descrizione obbligatoria, inserirne una: ");

    const importanza=readline.keyInYNStrict("Il task è importante?: ");

    const visibilita=readline.keyInYNStrict("Il task e' privato?: ");

    let data=null;
    do {
        data = readline.question("Inserire la deadline (YYYY-MM-DD) (oppure lasciare vuoto per nessuna scadenza): ");
        if (data && !isValid(new Date(data))) {
          console.error("Formato data non valido. Inserire nel formato YYYY-MM-DD oppure lasciare vuoto per nessuna scadenza.");
        }
      } while (data && !isValid(new Date(data)));
    const formattedDate = data ? format(new Date(data), 'yyyy-MM-dd') : null;
    
    let task={"descption":descrizione, "important":importanza, "private":visibilita, "deadline":formattedDate};
    tasks.push(task);
}

function deleteTaskByDescription(tasks){
    let descrizione=readline.question("Inserire la descrizione del task da eliminare: ");
    let toBeRemoved=[];
    for(let task of tasks){
        if(task.descption===descrizione){
            toBeRemoved.push(task);
        }
    }

    for(let element of toBeRemoved){
        tasks.splice(tasks.indexOf(element),1);
    }
}
function printTasks(tasks){
    tasks.sort((a,b)=> a.descption.localeCompare(b.descption));
    console.log(tasks);
}

let choice=0;
let tasks=[];
do{
    printMenu();
    choice = readline.question("Scelta: ");

    switch(choice){
        case "1":
            addTask(tasks);
            break;
        case "2":
            deleteTaskByDescription(tasks);
            break;
        case "3":
            printTasks(tasks);
            break;
        default:
            break;
    }

}while(choice!=4);