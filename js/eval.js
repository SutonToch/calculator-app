export function calcSolution(expr) {
    expr = findSubexprToCalc(expr, ["*", "/"])
    expr = findSubexprToCalc(expr, ["+", "-"])
    return expr
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

        if(!searchingForEndIndex && (expr[exprIndex] == ops[0] || expr[exprIndex] == ops[1])) {
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