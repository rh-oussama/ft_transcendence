const screen = document.getElementById('screen');
let input = "";

const operation = (type) => {
    const value = type.replace('btn', '');

    if (!isNaN(value)) {
        input += value;
        screen.textContent = input;
    } else if (["Add", "Subtract", "Multiply", "Divide"].includes(value)) {
        let opSymbol = '';
        switch (value) {
            case "Add":
                opSymbol = "+";
                break;
            case "Subtract":
                opSymbol = "-";
                break;
            case "Multiply":
                opSymbol = "*";
                break;
            case "Divide":
                opSymbol = "/";
                break;
        }
        input += opSymbol;
        screen.textContent = input;
    }
    else if (value == "AC") {
        input = "";
        screen.textContent = "";
    } else if (value == "Equals") {
        try {
            const result = eval(input);
            screen.textContent = result;
            input = result.toString();
        } catch (e) {
            screen.textContent = "Error";
            input = "";
        }
    }
}

["0","1","2","3","4","5","6","7","8","9","Add","Subtract","Multiply","Divide", "AC", "Equals"].forEach(val => {
    const btn = document.getElementById(`btn${val}`);
    if (btn)
        btn.onclick = () => operation(`btn${val}`);
});

