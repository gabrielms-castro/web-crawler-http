import { test, expect } from '@jest/globals'
import { getTextFromHTML } from '../src/parse.js';

test(
    "Get text from HTML",
    async () => {
        const input = `
<html>
    <h1>Título H1</h1>
</html>`;
        const actual = await getTextFromHTML(input);
        const expected = "Título H1";
        expect(actual).toEqual(expected)
    }
)