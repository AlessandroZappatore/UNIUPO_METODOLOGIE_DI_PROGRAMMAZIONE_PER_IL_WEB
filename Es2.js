"use strict" ;
let corsi="Metodologie di programmazione per il web, Algoritmi 1, Sistemi operativi 2, Basi di dati e sistemi informativi";
let array=corsi.split(", ");
console.log(array);

for(let element of array){
    console.log(element.toUpperCase());
}