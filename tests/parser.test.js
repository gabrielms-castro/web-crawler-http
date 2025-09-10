import { test, expect } from '@jest/globals'
import { getTextFromHTML, stripScriptsFromHTML } from '../src/parser.js';

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

test (
    "Get text from HTML complex",
    async () => {
        const input = `
<!DOCTYPE html>
<html>
  <body>
    <h1 id="title">Lorem Ipsum Unit Test Page</h1>
    <p id="intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In hac habitasse platea dictumst. Nulla facilisi.</p>
    <button id="btn">Click Me to Trigger Event</button>
    <form id="form"><input id="name" type="text" placeholder="Enter name"><button type="submit">Submit Form</button></form>
    <article id="article">This is a long test article containing repeated words, keywords like TESTING, MOCK, SAMPLE, and EDGECASE. Use this block for string searches, regex parsing, and text extraction validations in your tests.</article>
    <ul id="list"><li data-id="1">Alice Ipsum Longword Generator Content</li><li data-id="2">Bob Placeholder String for Assertions</li></ul>
    <div id="hidden" style="display:none;">Hidden Debug Text with Special Characters !@#$%^&*</div>
  </body>
</html>`;
        const actual = await getTextFromHTML(input);
        const expected = `Lorem Ipsum Unit Test Page Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In hac habitasse platea dictumst. Nulla facilisi. Click Me to Trigger Event Submit Form This is a long test article containing repeated words, keywords like TESTING, MOCK, SAMPLE, and EDGECASE. Use this block for string searches, regex parsing, and text extraction validations in your tests. Alice Ipsum Longword Generator ContentBob Placeholder String for Assertions Hidden Debug Text with Special Characters !@#$%^&*`;
        expect(actual).toEqual(expected)
    }
)

test(
    "strip script from HTML",
    () => {
        const input = `
<html>
 <head>
  <meta content="text/html; charset=utf-8">
 </head>
   <body>
    <p>test</p>
  </body>
 <script> console.log() </script>
</html>`
        const actual = stripScriptsFromHTML(input);
        const expected = `
<html>
 <head>
  <meta content="text/html; charset=utf-8">
 </head>
   <body>
    <p>test</p>
  </body>
</html>`
        expect(actual).toEqual(expected)
    }
)