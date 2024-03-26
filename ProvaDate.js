"use strict";
const readline = require("readline-sync");
const {format, endOfDay, differenceInMilliseconds, addDays, addMinutes} = require("date-fns");

let data=readline.question("Inserire la data (YYYY-MM-DD): ").trim();
if(!data.includes(" ")){
    data=endOfDay(data);
}
let result=format(new Date(data), "yyyy-MM-dd HH:mm:ss");

const now=format(new Date(), "yyyy-MM-dd HH:mm:ss");


console.log(result);
console.log(now);

result=format(addDays(result, 2), "yyyy-MM-dd HH:mm:ss");
console.log("A day added: "+result);

result=format(addMinutes(result, 30),  "yyyy-MM-dd HH:mm:ss");
console.log("30 minutes added: "+result);
//console.log("Differenza "+ differenceInMilliseconds(result, now));
