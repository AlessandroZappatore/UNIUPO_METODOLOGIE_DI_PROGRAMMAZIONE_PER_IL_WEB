"use strict" ;
let voti=[30, 28, 21, 18, 22, 27];
let copy=Array.from(voti);
let x=copy.shift();
let y=copy.shift();
console.log("Array originale = "+voti);

let votiOrdine=[18,19,20,21,22,23,24,25,26,27,28,29,30];
console.log(votiOrdine);
console.log("Array copia = "+copy);
let sum=0;
for(let element of voti){
    sum+=element;
}
let med1=sum/voti.length;

let sum2=0;
for(let element2 of copy){
    sum2+=element2;
}
let med2=sum2/copy.length;
console.log("Media primo vettore = "+Math.round(med1));
console.log("Media del vettore modificato = "+Math.round(med2));
