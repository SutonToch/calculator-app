const body = $("body");
const radio1 = $("#rd-theme1");
const radio2 = $("#rd-theme2");
const radio3 = $("#rd-theme3");
const display = $(".display")[0];
const inputButtons = $(".input-btn");
const delButton = $("#del-btn");
const resetButton = $("#reset-btn");
const equalButton = $(".equal-btn");
let firstInput = true;

radio1.click(() => {
    $(body).removeClass();
    $(body).addClass("theme1");
})

radio2.click(() => {
    $(body).removeClass();
    $(body).addClass("theme2");
})

radio3.click(() => {
    $(body).removeClass();
    $(body).addClass("theme3");
})

inputButtons.click((e) => {
    addToDisplay(e.currentTarget.textContent)
});

delButton.click(() => {
    if(display.textContent.length == 1) {
        resetDisplay();
        return;
    }
    display.textContent = display.textContent.slice(0, -1);
});

resetButton.click(() => {
    resetDisplay()
});

equalButton.click(() => {
    if(firstInput) {
        return;
    }
    evaluateDisplay();
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
}

function resetDisplay() {
    display.textContent = "0";
    firstInput = true;
}

function evaluateDisplay() {
    sanitizeDisplay()
    display.textContent = display.textContent.replaceAll("x", "*");
    display.textContent = eval(display.textContent); //temporary due to security risk of eval()
}

function sanitizeDisplay() {
    const lastDisplayChar = display.textContent.slice(-1);
    if(lastDisplayChar == "+" || lastDisplayChar == "-" || lastDisplayChar == "/" || lastDisplayChar == "x") {
        display.textContent = display.textContent.slice(0, -1);
    }
    display.textContent = display.textContent.replaceAll("x", "*");
}