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


let obj={
    Primo:"primo",
    Secondo:"secondo",
};

console.log(obj.Primo);
console.log(obj["Secondo"]);
obj.Terzo="terzo";
console.log(obj);
delete obj.Secondo;
console.log(obj);

for(let element in obj){
    console.log(obj[element]);
}

for(const prop in obj)
    console.log(`${prop} = ${obj[prop]}`)

let keys=Object.keys(obj);
console.log(keys);

let key_values=Object.entries(obj);
console.log(key_values);

let objCopy=Object.assign({}, obj);
console.log("Copia "+objCopy.Primo);

console.log("Terzo" in obj);
console.log("Quarto" in obj);

function Car(make, model, year){ //lettera maiuscola iniziale obbligatoria che sblocca l'operatore this e l'utilizzo del new
    this.make=make;
    this.model=model;
    this.year=year;
}

let mycar=new Car("Ferrari", "SF 90 Stradale", 2023);
console.log(mycar);

function doSomething (){ //lettera minuscola iniziale
    console.log("Hello World!");
}

doSomething();

function triplo(x, y=3){
    return x**3+y;
}

console.log(triplo(3, 5));

function sumAll(par1, ...arr){
    let sum=par1;
    for(let a of arr) sum+=a;
    return sum;
}

console.log(sumAll(0, 2, 4, 5));

const fn = function fun(x){
    return x**5;
}

console.log(fn(5));

const funz = (x) => {
    return Math.sqrt(x);
}

console.log(funz(100));

let fourth = (x) => x**4;
console.log(fourth(4));


const oneSec = setTimeout(()=>{
    console.log("HEY");
}, 0);

// import the library
/*const readlineSync = require('readline-sync');
// Wait for user's response.
var userName = readlineSync.question('May I have your name? ');
console.log('Hi ' + userName + '!');*/

let now = Date();

console.log(now);