"use strict" ;
let corsi="Metodologie di programmazione per il web, Algoritmi 1, Sistemi operativi 2, Basi di dati e sistemi informativi";
let array=corsi.split(", ");
let res=[];
for(let element of array){
    element=element.toUpperCase();
    let temp=element.split(" ");
    let r="";
    for(let el of temp){
        r=r+el[0];
    }
    res.push(r);
}

let r=[];
for (let [a,b] of res.entries()){
    r.push(`${a} - ${array[b]}`);
}
console.log(r);