"use strict" ;
let x="ciao";
var y;
console.log("x "+x);
console.log("y "+y);
var y=5;
//let x=5 Non possibile
console.log("new y "+y);
{ //new scope
    let x=5;
    console.log("new x "+x);
}

console.log("z "+z);
var z=5; //var support hoisting
let k=Math.log(100);
console.log(k);

if(k>4){
    console.log("Greater");
}
else{
    console.log("Lower");
}

let array=[1,2,3,4,5,6,7];

for (let i of array){
    console.log(i)
}

console.log("length "+array.length);

array[2]=10;
console.log(array);
array.unshift(120);
console.log(array);
let [s, o, ...p]=array;
console.log("S="+s+",O="+o+",P="+p);