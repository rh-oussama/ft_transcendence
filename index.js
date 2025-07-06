let a= [1, 2 , 3];


function add(arr, item) {
    arr.push(item);
    return arr.shift();
}

console.log(JSON.stringify(a));
add(a, 2);
console.log(JSON.stringify(a));