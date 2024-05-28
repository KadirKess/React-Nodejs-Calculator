// src/index.ts
// @ts-ignore
import express, { Request, Response } from 'express';
// @ts-ignore
import cors from 'cors';
import './calculator';
import {computeFromString} from "./calculator";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Calculator route
app.get('/api/calculate', (req: Request, res: Response) => {
    // The request will be an artithmetic expression as a string
    // We will evaluate the expression and return the result as a number
    const expression = req.query.expression as string;

    // Because we can not include + in the URL, we receive a # instead
    // We need to replace it with a + to evaluate the expression
    const expressionWithPlus = expression.replace(/%2B/g, "+");

    // The spaces are %20 in the URL, so we need to replace them with spaces
    var expressionWithSpaces = expressionWithPlus.replace(/%20/g, " ");

    if (expressionWithSpaces[0] === " ") {
        // If the first character is a space, we remove it
        expressionWithSpaces = expressionWithSpaces.substring(1);
    }

    if (expressionWithSpaces[expressionWithSpaces.length - 1] === " ") {
        // If the last character is a space, we remove it
        expressionWithSpaces = expressionWithSpaces.substring(0, expressionWithSpaces.length - 1);
    }

    try {
        const result = computeFromString(expressionWithSpaces);
        res.json({ result });
    } catch (error) {
        res.json({ error: error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
