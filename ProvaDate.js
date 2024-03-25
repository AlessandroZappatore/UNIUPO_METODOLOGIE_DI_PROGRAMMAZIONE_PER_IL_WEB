"use strict";
const readline = require("readline-sync");
const {format, endOfDay, differenceInMilliseconds} = require("date-fns");

let data=readline.question("Inserire la data (YYYY-MM-DD): ").trim();
if(!data.includes(" ")){
    data=endOfDay(data);
}
let result=format(new Date(data), "yyyy-MM-dd HH:mm:ss");

const now=format(new Date(), "yyyy-MM-dd HH:mm:ss");


console.log(result);
console.log(now);


console.log("Differenza "+ differenceInMilliseconds(result, now));
