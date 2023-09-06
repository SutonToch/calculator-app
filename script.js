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
let lastKeypressTime = 0;

// THEME-BUTTON EVENT LISTENER
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
    } else if(e.keyCode == 32) {
        //reset on double spacebar
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
        if(input == "+" || input == "/" || input == "x" || input == "." || input == "0") {
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
    calcSolution(display.textContent);
    // display.textContent = eval(display.textContent); //temporary due to security risk of eval()
}

function sanitizeDisplay() {
    const lastDisplayChar = display.textContent.slice(-1);
    if(lastDisplayChar == "+" || lastDisplayChar == "-" || lastDisplayChar == "/" || lastDisplayChar == "x") {
        display.textContent = display.textContent.slice(0, -1);
    }
    display.textContent = display.textContent.replaceAll("x", "*");
}

function calcSolution(expr) {
    console.log("Eval: " + eval(expr))
    expr = findSubexprToCalc(expr, ["*", "/"])
    expr = findSubexprToCalc(expr, ["+", "-"])
    display.textContent = expr
}

function findSubexprToCalc(expr, ops) {
    console.log("Expr: " + expr + "   Ops: " + ops)
    let exprIndex = 0
    let startIndex = 0
    let endIndex = expr.length //excluded
    let currentOp = ""
    let searchingForEndIndex = false
    let solutionStep = ""

    //remove ops that are not part of the current search
    let otherOps = ["+", "-", "/", "*"]
    ops.forEach(op => otherOps.splice(otherOps.indexOf(op), 1))

    while(exprIndex < expr.length) {
        if(!searchingForEndIndex && (expr[exprIndex] == otherOps[0] || expr[exprIndex] == otherOps[1])) {
            startIndex = exprIndex+1
        }

        if(!searchingForEndIndex && (expr[exprIndex] == ops[0] || expr[exprIndex] == ops[1])) { //potential optimization: remove !searchingForEndIndex to group up the same ops
            searchingForEndIndex = true
            currentOp = expr[exprIndex]
            exprIndex += 1
            if(expr[exprIndex] == "-") {
                exprIndex += 1
            }
            continue
        }

        if(searchingForEndIndex && (expr[exprIndex] == otherOps[0] || expr[exprIndex] == otherOps[1] || expr[exprIndex] == ops[0] || expr[exprIndex] == ops[1])) {
            endIndex = exprIndex
            solutionStep = calcExpr(expr.substring(startIndex, endIndex), currentOp)
            expr = expr.replace(expr.substring(startIndex, endIndex), solutionStep)
            // reset while-loop
            searchingForEndIndex = false
            exprIndex = 0
            startIndex = 0
            endIndex = expr.length
            continue
        }
        exprIndex += 1
    }
    if(searchingForEndIndex) {
        endIndex = expr.length
        solutionStep = calcExpr(expr.substring(startIndex, endIndex), currentOp)
        expr = expr.replace(expr.substring(startIndex, endIndex), solutionStep)
    }
    return expr
}

function calcExpr(subExpr, op) {
    const nums = subExpr.split(op)
    let solution = Number(nums[0])
    if(op == "*") {
        for(let i=1; i<nums.length; i++) {
            solution *= Number(nums[i])
        }
    } else if(op == "/") {
        for(let i=1; i<nums.length; i++) {
            solution /= Number(nums[i])
        }
    } else if(op == "+") {
        for(let i=1; i<nums.length; i++) {
            solution += Number(nums[i])
        }
    } else if(op == "-") {
        for(let i=1; i<nums.length; i++) {
            solution -= Number(nums[i])
        }
    }
    return String(solution)
}