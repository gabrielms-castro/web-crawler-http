import { test, expect } from '@jest/globals'
import { normalizeURL, getURLFromHTML, normalizeFileName,getCharmapFromHTML} from '../src/crawl.js';

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
    'getURLFromHTML',
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
        const inputBaseURL = 'https://blog.boot.dev/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/']
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLFromHTML relative',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="path/">
            Boot.dev Blog
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/path/']
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLFromHTML multiple URLs',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path1/">
            Boot.dev Blog One
        </a>
        <a href="path2/">
            Boot.dev Blog Two
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/']
        expect(actual).toEqual(expected)
    }
);


test(
    'getURLFromHTML relative without starting slash',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="path2/">
            Boot.dev Blog One
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://blog.boot.dev/path/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ["https://blog.boot.dev/path/path2/"]
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLFromHTML relative without starting slash complex',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="Alvara/Alvara-quadro.htm">
            Boot.dev Blog One
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://www.planalto.gov.br/ccivil_03/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ["https://www.planalto.gov.br/ccivil_03/Alvara/Alvara-quadro.htm"]
        expect(actual).toEqual(expected)
    }
);

test(
    'getURLFromHTML relative without starting slash complex',
    () => {
        const inputHTMLBody = `
<html>
    <body>
        <a href="Alvara/Alvara-quadro.htm">
            Boot.dev Blog One
        </a>
    </body>
</html>
`
        const inputBaseURL = 'https://www.planalto.gov.br/ccivil_03/';
        const actual = getURLFromHTML(inputHTMLBody, inputBaseURL);
        const expected = ["https://www.planalto.gov.br/ccivil_03/Alvara/Alvara-quadro.htm"]
        expect(actual).toEqual(expected)
    }
);


test(
    "Normalize File Name without extension",
    () => {
        const input = 'https://www.planalto.gov.br/ccivil_03/'
        const actual = normalizeFileName(input);
        const expected = 'ccivil_03.html'
        expect(actual).toEqual(expected)
    }
)
test(
    "Normalize File Name with extension",
    () => {
        const input = 'https://www.planalto.gov.br/ccivil_03/L10403.htm'
        const actual = normalizeFileName(input);
        const expected = 'L10403.html'
        expect(actual).toEqual(expected)
    }
)

test(
    "Normalize File Name with .htm extension",
    () => {
        const input = ' https://www.planalto.gov.br/Portaria/quadro_portaria.htm'
        const actual = normalizeFileName(input);
        const expected = 'quadro_portaria.html'
        expect(actual).toEqual(expected)
    }
)
test(
    "Normalize File Name with .html extension",
    () => {
        const input = ' https://www.planalto.gov.br/Portaria/quadro_portaria.html'
        const actual = normalizeFileName(input);
        const expected = 'quadro_portaria.html'
        expect(actual).toEqual(expected)
    }
)

test(
    "Normalize File Name without extension and slash",
    () => {
        const input = ' https://www.planalto.gov.br/Portaria/'
        const actual = normalizeFileName(input);
        const expected = 'Portaria.html'
        expect(actual).toEqual(expected)
    }
)
test(
    "Get charmap from <head>",
    () => {
        const input = `
<head>
  <meta content="PORTARIA No 1.492 DE 5/10/2011. http://www.planalto.gov.br/ccivil_03/Portaria/P1492-11-ccivil.htm" name="Copyright">
  <meta content="pt-br" http-equiv="Content-Language">
  <meta content="text/html; charset=iso8859-1" http-equiv="Content-Type">
  <meta charset="iso8859-1">
  <link href="../../../css/legis_3.css" rel="stylesheet" type="text/css">
  <script src="../../../js/includeHTML.js">
  </script>
  <meta content="Package: 'incolumepy.saj_projects', Version: '2020.5.0-dev34', URL oficial: https://pypi.org/project/incolumepy.saj-projects" name="generator">
 </head>
`
        const actual = getCharmapFromHTML(input);
        const expected = 'iso8859-1'
        expect(actual).toEqual(expected)
    }
)