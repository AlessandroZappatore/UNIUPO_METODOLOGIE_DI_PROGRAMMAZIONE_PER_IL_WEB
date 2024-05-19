"use strict";

const Task = require("./task");
const db = require("./db");

/**
 * Converts a DB row into a Task
 */
const createTask = function (dbTask) {
  const importantTask = dbTask.important === 1;
  const privateTask = dbTask.privateTask === 1;
  const completedTask = dbTask.completed === 1;
  const task = new Task(
    dbTask.taskId,
    dbTask.description,
    privateTask,
    importantTask,
    dbTask.projectName,
    dbTask.deadline,
    completedTask
  );
  console.log(task);
  return task;
};

exports.getTasks = function () {
  return new Promise((resolve, reject) => {
    const querySql = "SELECT * FROM Task";
    db.all(querySql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (!rows || rows.length === 0) {
          resolve({ error: "No tasks found." });
        } else {
          resolve(rows.map(row => createTask(row)));
        }
      }
    });
  });
};

exports.getTask = function (id) {
  return new Promise((resolve, reject) => {
    const querySql = "SELECT * FROM Task WHERE taskId=?";
    db.get(querySql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if (!row) {
          resolve({ error: "No task found" });
        } else {
          resolve(createTask(row));
        }
      }
    });
  });
};

exports.deleteTask = function (id) {
  return new Promise((resolve, reject) => {
    const querySql = "DELETE FROM Task WHERE taskId=?";
    db.run(querySql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

exports.addTask = function (newTask) {
  return new Promise((resolve, reject) => {
    const querySql =
      "INSERT INTO Task (description, important, privateTask, projectName, deadline, completed) VALUES (?, ?, ?, ?, DATETIME(?), ?)";

    db.run(
      querySql,
      [
        newTask.description,
        newTask.important,
        newTask.private,
        newTask.projectName,
        newTask.deadline,
        newTask.completed
      ],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
};

exports.setCompleted = function (id) {
  return new Promise((resolve, reject) => {
    const querySql = "UPDATE Task SET completed = 1 WHERE taskId = ?";
    db.run(querySql, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes === 0) {
          resolve({ error: "Task not found" });
        } else {
          resolve();
        }
      }
    });
  });
};

exports.updateTask = function(id, newTask){
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE Task SET description = ?, important = ?, privateTask = ?, projectName = ?, deadline = DATETIME(?), completed = ? WHERE taskId = ?';
        db.run(sql,  [newTask.description, newTask.important, newTask.privateTask, newTask.project, newTask.deadline, newTask.completed, id], 
        function (err) {
            if(err){
                reject(err);
            } else { 
                if (this.changes === 0)
                    resolve({error: 'Task not found.'});
                else {
                    resolve();
                }
            }
        })
    });
    
}