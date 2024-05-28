// This function will check if a token is a valid number
const checkNumberToken = (token: string): string => {
    var pointMet = false;
    var startingPos = 0;

    if (token[0] == "-" || token[0] == "+") { // If the first character is a minus or a plus, we skip it
        startingPos = 1;
    }

    for (let i = startingPos; i < token.length; i++) {
        if (token[i] == ".") {
            if (pointMet) {
                throw Error("Operation is invalid: Invalid number");
            } else {
                if (i == startingPos || i == token.length - 1) { // The point can not be the first or last character
                    throw Error("Operation is invalid: Invalid number");
                }
                pointMet = true; // We can only have one point
            }
        } else if (!(token[i] >= "0" && token[i] <= "9")) { // For any other character, it has to be a digit
            throw Error("Operation is invalid: Invalid number");
        }
    }

    return "number";
}

// This function will check if a token is a number, an operator or a parenthesis
const checkExpressionToken = (token: string): string => {
    const operators = ["+", "-", "/", "*"];

    if (token.length > 1) { // If the length is greater than 1, it has to be a number
        return checkNumberToken(token);
    } else { // Else, it is an operator or a parenthesis
        if (token >= "0" && token <= "9")
            return "number";
        else if (operators.includes(token))
            return "operator";
        else if (token == "(" || token == ")")
            return "parenthesis";
    }

    throw Error("Operation is invalid: Input is invalid");
}

// This function will make an operation given two numbers and an operator
const makeOperation = (first: number, second: number, operator: string): number => {
    switch (operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            if (second == 0) {
                throw Error("Operation is invalid: Division by zero");
            } else {
                return first / second;
            }
        default:
            throw Error("Operation is invalid: Invalid operator");
    }
}

// This function will compare two operators
// It will return true if the first operator has a higher precedence than the second one
const compareOperators = (operator1: string, operator2: string): boolean => {
    const precedence: { [key: string]: number } = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    }

    return precedence[operator1] >= precedence[operator2];
}

// Type guard function to check for undefined values
const isDefined = <T>(value: T | undefined): value is T => {
    return value !== undefined;
}

// This function will compute the result of an arithmetic expression, we will use Dijkstra’s Two-Stack Algorithm
export const computeFromString = (expression: string): string => {
    // We split the expression into tokens
    const expressionArray = expression.split(" ");

    // We will use two stacks, one for the numbers and one for the operators
    const numbers: number[] = [];
    const operators: string[] = [];
    const leftParenthesisCounter: string[] = []; // We use this stack to check that parenthesis are valid

    // We iterate over every element of the expression
    for (const expressionArrayToken of expressionArray) {
        switch (checkExpressionToken(expressionArrayToken)) {
            // If we have a number, we simply push it into the numbers stack
            case "number":
                numbers.push(parseFloat(expressionArrayToken));
                break;

            // If we have a parenthesis, it'll depend on the type of parenthesis we have
            case "parenthesis":
                if (expressionArrayToken == "(") { // Left means we push it into the stacks
                    operators.push(expressionArrayToken);
                    leftParenthesisCounter.push(expressionArrayToken);
                } else {
                    if (leftParenthesisCounter.length == 0) {
                        throw Error("Operation is invalid: Parenthesis not closing");
                    } else {
                        leftParenthesisCounter.pop();

                        while (operators[operators.length - 1] != "(") {
                            if (numbers.length < 2) {
                                throw Error("Operation is invalid: Invalid Input")
                            } else {
                                const operator = operators.pop();
                                const value1 = numbers.pop();
                                const value2 = numbers.pop();

                                // Check for undefined values
                                if (isDefined(value1) && isDefined(value2) && isDefined(operator)) {
                                    numbers.push(makeOperation(value2, value1, operator));
                                } else {
                                    throw Error("Operation is invalid: Invalid Input");
                                }
                            }
                        }

                        operators.pop();
                    }
                }
                break;

            // If we have an operator, we have to check the precedence
            case "operator":
                while (operators.length > 0 && compareOperators(operators[operators.length - 1], expressionArrayToken)) {
                    if (numbers.length < 2) {
                        throw Error("Operation is invalid: Invalid Input")
                    } else {
                        const operator = operators.pop();
                        const value1 = numbers.pop();
                        const value2 = numbers.pop();

                        // Check for undefined values
                        if (isDefined(value1) && isDefined(value2) && isDefined(operator)) {
                            numbers.push(makeOperation(value2, value1, operator));
                        } else {
                            throw Error("Operation is invalid: Invalid Input");
                        }
                    }
                }

                operators.push(expressionArrayToken);
                break;

            default:
                throw Error("Operation is invalid: Invalid Input")
        }
    }

    // We complete the operations that are left
    while (operators.length > 0) {
        if (numbers.length < 2) {
            throw Error("Operation is invalid: Invalid Input")
        } else {
            const operator = operators.pop();
            const value1 = numbers.pop();
            const value2 = numbers.pop();

            // Check for undefined values
            if (isDefined(value1) && isDefined(value2) && isDefined(operator)) {
                numbers.push(makeOperation(value2, value1, operator));
            } else {
                throw Error("Operation is invalid: Invalid Input");
            }
        }
    }

    // We return the result as a string
    return numbers[0].toString();
}
