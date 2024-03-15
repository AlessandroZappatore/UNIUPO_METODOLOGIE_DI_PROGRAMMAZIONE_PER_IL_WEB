"use strict" ;
const corsi="Metodologie di programmazione per il web, Sistemi operativi 1, Matematica discreta, Basi di dati e sistemi informativi, Paradigmi di programmazione";

let array=corsi.split(",");
for (let i = 0; i < array.length; i++) {
    array[i] = array[i].trim()
}

let acronimi=[];
for(let element of array){
    element=element.toUpperCase();
    let tmp=element.split(" ");
    let res="";
    for(let el of tmp){
        res=res+el[0];
    }
    acronimi.push(res);
}

const risultato=[];
for(let [i, ele] of acronimi.entries()){
    risultato.push(`${ele}/${array[i]}`);
}

console.log(risultato.sort());