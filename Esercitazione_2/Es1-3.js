"use strict";
const readline = require("readline-sync");
const { format, isValid } = require("date-fns");

function printMenu() {
  console.log("1. Inserire un nuovo task");
  console.log("2. Rimuovere i task in base alla descrizione");
  console.log("3. Rimuovere i task in base alla data")
  console.log("4. Mostrare tutti i task esistenti, in ordine alfabetico");
  console.log("5. Chiudere il programma");
}

function inputDate(){
  let data = null;
  do {
    data = readline.question(
      "Inserire la data (YYYY-MM-DD) (oppure lasciare vuoto per nessuna scadenza): ");
    if (data && !isValid(new Date(data))) {
      console.error(
        "Formato data non valido. Inserire nel formato YYYY-MM-DD oppure lasciare vuoto per nessuna scadenza.");
    }
  } while (data && !isValid(new Date(data)));
  const formattedDate = data ? format(new Date(data), "yyyy-MM-dd") : null;
  return formattedDate;
}

function addTask(tasks) {
  let descrizione = readline.question("Inserire la descrizione: ");
  while (descrizione == "")
    descrizione = readline.question(
      "Descrizione obbligatoria, inserirne una: "
    );

  const importanza = readline.keyInYNStrict("Il task è importante?: ");

  const visibilita = readline.keyInYNStrict("Il task e' privato?: ");

  const data=inputDate();

  let task = {
    descption: descrizione,
    important: importanza,
    private: visibilita,
    deadline: data,
  };
  tasks.push(task);
}

function deleteTaskByDescription(tasks) {
  let descrizione = readline.question("Inserire la descrizione del task da eliminare: ");
  let toBeRemoved = [];
  for (let task of tasks) {
    if (task.descption === descrizione) {
      toBeRemoved.push(task);
    }
  }

  for (let element of toBeRemoved) {
    tasks.splice(tasks.indexOf(element), 1);
  }
}

function deleteTaskByDate(tasks){
    const deleteData=inputDate();
    let toBeRemoved=[];
    for(let task of tasks){
      if(task.deadline === deleteData){
        toBeRemoved.push(task);
      }
    }

    for(let element of toBeRemoved){
      tasks.splice(tasks.indexOf(element), 1);
    }
}

function printTasks(tasks) {
  tasks.sort((a, b) => a.descption.localeCompare(b.descption));
  console.log(tasks);
}

let choice = 0;
let tasks = [];
do {
  printMenu();
  choice = readline.question("Scelta: ");

  switch (choice) {
    case "1":
      addTask(tasks);
      break;
    case "2":
      deleteTaskByDescription(tasks);
      break;
    case "3":
      deleteTaskByDate(tasks);
      break;
    case "4":
      printTasks(tasks);
      break;
    default:
      break;
  }
} while (choice != 5);