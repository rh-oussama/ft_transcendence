function diceRoller() {
    let diceNumber = Number(document.getElementById("diceInput").value) || 1;
    let roller = [];
    let diceContainer = document.getElementById("diceContainer");
    let imagesHTML = "";

    diceContainer.innerHTML = "";
    for (let i = 0; i < diceNumber; i++) {
        let roll = Math.floor(Math.random() * 6) + 1;
        roller.push(roll);
        imagesHTML += `<img src="dice_image/${roll}.png">`;
    }
    diceContainer.style.display = "flex";
    diceContainer.innerHTML = imagesHTML;
}