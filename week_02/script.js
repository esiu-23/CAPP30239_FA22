/* Test script 
This is a javascript example for
week 2.
*/

let num = 100; //integer

function foo() {
    let num2 = 200;
    console.log(num)
};

foo();

// let anonFun = function(){
//     console.log("hello")
// };

// let anonFun = () => console.log("hello")

// Two functions above are equivalent, just the one above with arrow is a shorthand

// Immediately invoked function - when you can use anonymous functions
// Runs when you open the browser
(() => console.log("hi"))();

let person = "Summer";

function people(peopleName){
    console.log("Hello" + peopleName);
};

people(person);

// Arrays are square brackets, can have subarrays, any type of value allowed
let arr = ["a", 1, ["subarray"]]
console.log(arr[2])
// Adds to end of array
arr.push("car")
// Removes a value (index, item you're deleting)
arr.splice(2, 1);
console.log(arr)

// "of" = returns item
for (let item of arr)(
    console.log(item)
)

// "in" = index
for (let i in arr){
    console.log(i + " " + arr[i])
}

// combine anonymous function with looping
arr.forEach((item, i) => console.log(i + " plus " + item));


// JSON - javascript object notation
let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter"
};
// Name, age, job fields can also be put in quotes

console.log(obj1.name);
console.log(obj1["name"]);

// override fields in JSON object
obj1.job = "Barista";

console.log(obj1);

for (let key in obj1){
    let value = obj1[key]
    console.log(`${key}: ${value}`); 
    // String literal shortcut for console logging
}

//  backtick ` = object notation , ${} string literal to include a variable
console.log(`testing shortcut: ${obj1["name"]} + ${num}`);

// Another way to loop through in your code using an iterator. Javascript is index 0.
for (let i = 0; i < 10; i ++){
    console.log(i)
}

let x = 75

/* if/else is very similar to python

if (criteria){
    console.log("Above average");
}  else if (criteria) {
    console.log("belo average");
};
*/

// ternary operator (aka inline if/else), aka list operator
let y = (x > 50) ? console.log("Above Average") : console.log("Below Average");

// traverse the dom (document object management)
//  example is name of our div ID from our HTML script

// Make sure javascript source is always after the div ID tag that you're referencing
// You can re-use the javascript element on any page you want, just put it under the div ID tag you want to put on the page.
// You can also run multiple different javascript files under one div ID tag. 
let example = document.getElementById("example")

example.innerHTML += "Hello world";







