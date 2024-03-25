"use strict";
const readline = require("readline-sync");
const { format, isValid, getUnixTime } = require("date-fns");

function printMenu() {
  console.log("1. Inserire un nuovo task");
  console.log("2. Rimuovere i task in base alla descrizione");
  console.log("3. Rimuovere i task in base alla data");
  console.log("4. Mostrare tutti i task esistenti, in ordine alfabetico");
  console.log("5. Chiudere il programma");
}

function inputDate() {
  let data=readline.question("Inserire la data (YYYY-MM-DD): ").trim();
  if(!data.includes(" ")){
    data+=" 23:59:59z";
  }

  const deadline=new Date(data);
  return deadline;
}

function addTask(tasks) {
  let descrizione = readline.question("Inserire la descrizione: ");
  while (descrizione == "")
    descrizione = readline.question(
      "Descrizione obbligatoria, inserirne una: "
    );

  const importanza = readline.keyInYNStrict("Il task è importante?: ");

  const visibilita = readline.keyInYNStrict("Il task e' privato?: ");

  const data = inputDate();

  let task = {
    descption: descrizione,
    important: importanza,
    private: visibilita,
    deadline: data,
  };
  tasks.push(task);

  if(!Number.isNaN(data.getTime())){
    const now=new Date();
    setTimeout(function(task){
      tasks.splice(tasks.indexOf(task), 1);
    }, data.getTime()-now.getTime(), task);
  }
}

function deleteTaskByDescription(tasks) {
  let descrizione = readline.question(
    "Inserire la descrizione del task da eliminare: "
  );
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

function deleteTaskByDate(tasks) {
  const deleteData = inputDate();
  let toBeRemoved = [];
  for (let task of tasks) {
    if (task.deadline === deleteData) {
      toBeRemoved.push(task);
    }
  }

  for (let element of toBeRemoved) {
    tasks.splice(tasks.indexOf(element), 1);
  }
}

function printTasks(tasks) {
  if (tasks.length === 0) {
    console.log("Nessun task presente!");
    return;
  }

  tasks.sort((a, b) => a.descption.localeCompare(b.descption));

  console.log("** I tuoi task **");
  console.log("--------------------");

  tasks.forEach((task, index) => {
    let taskString = `${index + 1}. ${task.descption}`;
    if (task.important) {
      taskString += " (Importante)";
    }
    else{
      taskString += " (Non importante)";
    }
    if (task.private) {
      taskString += " (Privato)";
    } else {
      taskString += " (Pubblico)";
    }
    if (task.deadline) {
      taskString += ` - Scadenza: ${task.deadline}`;
    }
    console.log(taskString);
  });
}

let choice = 0;
let tasks = [];
console.log("------------------------TASK-MANAGER------------------------");
const menu = setInterval(() => {
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
    case "5":
      clearInterval(menu);
    default:
      break;
  }
  console.log("------------------------------------------------------------");
}, 1000);
