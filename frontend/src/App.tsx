import {calculate} from "./Api.ts";
import React, { useState } from 'react';
import './App.css'

function App() {
    // We will use state to keep track of the input and the display
    const [input, setInput] = useState('');
    const [display, setDisplay] = useState('');

    // This function will be called when a button is clicked
    async function handleClick(event: React.MouseEvent) {
        const target = event.target as HTMLButtonElement;

        if (target.value === "=") { // If the button is the equal sign
            try {
                var newInput = "";

                for (const inputElement of input) { // We process the input to replace the characters
                    if (inputElement == "-" ||
                        inputElement == "*" ||
                        inputElement == "/" ||
                        inputElement == "(" ||
                        inputElement == ")") {

                        newInput += "%20" + inputElement + "%20";
                    } else if (inputElement == "+") {
                        newInput += "%20%2B%20";
                    } else {
                        newInput += inputElement;
                    }
                }

                const result = await calculate(newInput); // We calculate the result
                setDisplay(result);
                setInput(result)
            } catch (error) {
                console.log("The input is invalid.");
            }
        } else if (target.value === "C") { // If the button is the clear button
            setInput("");
            setDisplay("");
        } else { // If the button is a number or an operator
            setInput(input + target.value);

            if (target.value == "*") {
                setDisplay(display + "×");
            } else if (target.value == "/") {
                setDisplay(display + "÷");
            } else {
                setDisplay(display + target.value);
            }
        }
    }

    return (
        <div className="App">
            <input type="text" value={display} readOnly/>
            <div className="calculator-grid">

                <button onClick={handleClick} value="+">+</button>
                <button onClick={handleClick} value="-">-</button>
                <button onClick={handleClick} value="/">÷</button>
                <button onClick={handleClick} value="*">×</button>

                <button onClick={handleClick} value="1">1</button>
                <button onClick={handleClick} value="2">2</button>
                <button onClick={handleClick} value="3">3</button>
                <button onClick={handleClick} value="(">(</button>

                <button onClick={handleClick} value="4">4</button>
                <button onClick={handleClick} value="5">5</button>
                <button onClick={handleClick} value="6">6</button>
                <button onClick={handleClick} value=")">)</button>

                <button onClick={handleClick} value="7">7</button>
                <button onClick={handleClick} value="8">8</button>
                <button onClick={handleClick} value="9">9</button>
                <button onClick={handleClick} value="=" className="equal">=</button>

                <button onClick={handleClick} value="C" className="clear">C</button>
                <button onClick={handleClick} value="0">0</button>

            </div>
        </div>

    )
}

export default App
