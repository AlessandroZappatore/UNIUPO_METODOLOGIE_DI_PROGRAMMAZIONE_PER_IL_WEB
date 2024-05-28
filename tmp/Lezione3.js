"use strict";
let array=[1,2,3,4,5];

console.log(array.every(x => x<10)==true)
console.log(array.every(x => x%2 ==0))

let b=array.map(x => x*x);
console.log(b);

console.log(array.filter(x => x<3));

console.log(array.reduce((acc, val) => acc*val, 1))

console.log(array.reduce((acc, val) => (acc<val) ? acc : val, 5))

let date = new Date();

console.log(Object.getPrototypeOf(date));

function Person(first, last, age, gender, interests) {
    this.name = { 'first': first, 'last' : last };
    this.age = age;
    this.gender = gender;
    this.interests = interests;
    }
    Person.prototype.sleep = function() {
    console.log(`${this.name.first} is sleeping.`)
    }
    function Student(first, last, age, gender, interests, id) {
    Person.call(this, first, last, age, gender, interests);
    this.id = id;
    this.study = function() {
    console.log(`${this.name.first} is studying.`)
    }
    }
    Student.prototype = Object.create(Person.prototype);
    let student = new Student ('Marta', 'Verdi', 22, 'female', ['music', 'skiing'], 123456);
    student.sleep();