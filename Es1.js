"use strict" ;
const voti=[18, 21, 26, 28, 30, 28, 30];
let copy=Array.from(voti);
const votiOrdine=[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

const i=12-votiOrdine.indexOf(voti[0]);
const j=12-votiOrdine.indexOf(voti[1]);

copy.splice(0, 2, votiOrdine[i], votiOrdine[j]);

let res="";
let sum=0;
for(const element of voti){
    res+=`${element} `;
    sum+=element;
}
console.log("Voti originali: "+res+"Media: "+Math.round(sum/voti.length));

res="";
sum=0;
for(const element of copy){
    res+=`${element} `;
    sum+=element;
}
console.log("Voti modificati: "+res+"Media: "+Math.round(sum/copy.length));
