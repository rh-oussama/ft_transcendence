


let number;

function decrease() {
    number = Number(document.getElementById("number").textContent);
    number--;
    document.getElementById('number').textContent = number;
    
}

function reset() {
    document.getElementById('number').textContent = "0";
}

function increase() {
    number = Number(document.getElementById("number").textContent);
    number++;
    document.getElementById('number').textContent = number;
}