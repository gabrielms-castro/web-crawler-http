const { normalizeURL, getURLfromHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test(
    'normalizeURL strip protocol',
    () => {
        const input = 'https://blog.boot.dev/path'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'
        expect(actual).toEqual(expected)
    }
);

test(
    'normalizeURL strip trailing slash',
    () => {
        const input = 'https://blog.boot.dev/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'
        expect(actual).toEqual(expected)
    }
);

test(
    'normalizeURL capitals',
    () => {
        const input = 'https://blog.BOOT.dEv/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'
        expect(actual).toEqual(expected)
    }
);

test(
    'normalizeURL strip HTTP',
    () => {
        const input = 'http://blog.boot.dev/path/'
        const actual = normalizeURL(input)
        const expected = 'blog.boot.dev/path'
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLfromHTML',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev">
            Boot.dev Blog
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev';
        const actual = getURLfromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/']
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLfromHTML relative',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="/path/">
            Boot.dev Blog
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev';
        const actual = getURLfromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/path/']
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLfromHTML multiple URLs',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path1/">
            Boot.dev Blog One
        </a>
        <a href="/path2/">
            Boot.dev Blog Two
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev';
        const actual = getURLfromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/']
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLfromHTML multiple URLs',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="Invalid">
            Invalid
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev';
        const actual = getURLfromHTML(inputHTMLBody, inputBaseURL);
        const expected = []
        expect(actual).toEqual(expected)
    }
);