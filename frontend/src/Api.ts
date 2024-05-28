// This file connects the frontend and the backend.
const apiUrl = new URL('http://localhost:3000/api/calculate'); // The URL of the backend

export async function calculate(expression: string) {
    const response = await fetch(apiUrl.toString() + `?expression=${expression}`);
    const json = await response.json();
    if (json.error) {
        throw new Error(json.error);
    } else {
        return json.result;
    }
}