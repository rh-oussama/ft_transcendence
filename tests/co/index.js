



let result;
let isCeli;
let isFahr;

function chtemp() {
    let tmp = Number(document.getElementById("tempInput").textContent);
    isCeli = document.getElementById("celToFah").checked;
    if (isCeli) {
        result = (tmp *(9/5)) + 32;
    } else {
        result = (tmp - 32) * 5/9
    }
    document.getElementById("result").textContent = result
}