import { calcSolution } from "./eval.js";
const display = $(".display")[0];
const inputButtons = $(".input-btn");
const delButton = $("#del-btn");
const resetButton = $("#reset-btn");
const equalButton = $(".equal-btn");
let firstInput = true;
let lastKeypressTime = 0;


// KEYPAD EVENT LISTENER
inputButtons.click((e) => {
    addToDisplay(e.currentTarget.textContent)
});

delButton.click(() => {
    deleteLastCharFromDisplay();
});

resetButton.click(() => {
    resetDisplay()
});

equalButton.click(() => {
    evaluateDisplay();
});

// KEYPAD-INPUT USING KEYBOARD
$(document).on("keydown", function(e) {
    if(e.keyCode == 13 || (e.shiftKey && e.keyCode == 48)) {
        evaluateDisplay();
    } else if(e.keyCode == 17) {
        //reset on double Ctrl
        const delta = 200;
        let thisKeypressTime = new Date();
        
        if(thisKeypressTime - lastKeypressTime <= delta) {
          resetDisplay();
          thisKeypressTime = 0;
        }
        lastKeypressTime = thisKeypressTime;
    } else if(e.keyCode == 46 || e.keyCode == 8) {
        deleteLastCharFromDisplay()
    } else if(e.keyCode == 111 || (e.shiftKey && e.keyCode == 55)) {
        e.preventDefault();
        addToDisplay("/");
    } else if(e.keyCode == 88 || e.keyCode == 106 || (e.shiftKey && e.keyCode == 171)) {
        addToDisplay("x");
    } else if(e.keyCode == 173 || e.keyCode == 109) {
        addToDisplay("-");
    } else if(e.keyCode == 171 || e.keyCode == 107) {
        addToDisplay("+");
    } else if(e.keyCode == 48 || e.keyCode == 96) {
        addToDisplay("0");
    } else if(e.keyCode == 49 || e.keyCode == 97) {
        addToDisplay("1");
    } else if(e.keyCode == 50 || e.keyCode == 98) {
        addToDisplay("2");
    } else if(e.keyCode == 51 || e.keyCode == 99) {
        addToDisplay("3");
    } else if(e.keyCode == 52 || e.keyCode == 100) {
        addToDisplay("4");
    } else if(e.keyCode == 53 || e.keyCode == 101) {
        addToDisplay("5");
    } else if(e.keyCode == 54 || e.keyCode == 102) {
        addToDisplay("6");
    } else if(e.keyCode == 55 || e.keyCode == 103) {
        addToDisplay("7");
    } else if(e.keyCode == 56 || e.keyCode == 104) {
        addToDisplay("8");
    } else if(e.keyCode == 57 || e.keyCode == 105) {
        addToDisplay("9");
    } else if(e.keyCode == 190 || e.keyCode == 188 || e.keyCode == 110) {
        addToDisplay(".");
    }
});

function addToDisplay(input) {
    const incorrectInput = checkForIncorrectInput(input);
    if(incorrectInput) {
        return;
    }

    if(firstInput) {
        display.textContent = input;
        firstInput = false;
        return;
    }

    display.textContent += input;
}

function checkForIncorrectInput(input) {
    //no arithmetic character as first input
    if(firstInput) {
        if(input == "+" || input == "/" || input == "x" || input == ".") {
            return true;
        }
    }

    const lastDisplayChar = display.textContent.slice(-1);
    //no double arithmetic characters
    if(input == "+" || input == "-" || input == "/" || input == "x" || input == ".") {
        if(input == lastDisplayChar) {
            return true;
        }
    }

    //no + / x . after a arithmetic character
    if(input == "+" || input == "/" || input == "x" || input == ".") {
        if(lastDisplayChar == "+" || lastDisplayChar == "-" || lastDisplayChar == "/" || lastDisplayChar == "x" || lastDisplayChar == ".") {
            return true;
        }
    }

    //no multiple . within a single number
    if(input == ".") {
        let checking = true;
        let checkIndex = -1;
        let checkChar = "";
        while(checking) {
            checkChar = display.textContent.slice(checkIndex-1, checkIndex);
            if(checkChar == ".") {
                return true;
            }
            if(checkChar == "+" || checkChar == "-" || checkChar == "/" || checkChar == "x") {
                checking = false;
            }
            if(Math.abs(checkIndex) > display.textContent.length) {
                checking = false;
            }
            checkIndex -= 1;
        }
    }
}

function deleteLastCharFromDisplay() {
    if(display.textContent.length == 1) {
        resetDisplay();
        return;
    }
    display.textContent = display.textContent.slice(0, -1);
}

function resetDisplay() {
    display.textContent = "0";
    firstInput = true;
}

function evaluateDisplay() {
    if(firstInput) {
        return;
    }
    sanitizeDisplay();
    display.textContent = calcSolution(display.textContent);
}

function sanitizeDisplay() {
    const lastDisplayChar = display.textContent.slice(-1);
    if(lastDisplayChar == "+" || lastDisplayChar == "-" || lastDisplayChar == "/" || lastDisplayChar == "x") {
        display.textContent = display.textContent.slice(0, -1);
    }
    display.textContent = display.textContent.replaceAll("x", "*");
}