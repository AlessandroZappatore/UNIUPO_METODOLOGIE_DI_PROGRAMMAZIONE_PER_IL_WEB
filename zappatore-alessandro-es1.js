"use strict" ;
const voti=[18, 21, 26, 28, 30, 28, 19, 30];
let copy=Array.from(voti);
copy.sort();
const votiOrdine=[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const N=2;

for(let i=0; i<N; i++){
    copy.splice(i, 1, votiOrdine[12-votiOrdine.indexOf(voti[i])]);
}

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
