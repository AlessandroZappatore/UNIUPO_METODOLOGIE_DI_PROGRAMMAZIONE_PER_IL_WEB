"use strict";
let array=["estate", "inverno", "primavera", "autunno", "a"];
let array2=["prova", "q", "rana"];
function fun(arr){
    for(let [i, a] of arr.entries()){
        if(a.length<2) arr[i]=""
        else arr[i]=a.slice(0,2)+a.slice(a.length-2,a.length);
    }
    return arr;
}

console.log(fun(array));
console.log(fun(array2));