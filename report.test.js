const { sortPages } = require('./report.js')
const { test, expect } = require('@jest/globals');

test(
    "sortPages",
    () => {
        const input = {
            'https://wagslane.dev/path': 2,
            'https://wagslane.dev/path/subpath': 1,
            'https://wagslane.dev': 3,
        }
        const actual = sortPages(input);
        const expected = [
            ['https://wagslane.dev', 3],
            ['https://wagslane.dev/path', 2],
            ['https://wagslane.dev/path/subpath', 1]

        ]
        expect(actual).toEqual(expected);
    }
)

test(
    "sortPages 5 pages",
    () => {
        const input = {
            'https://wagslane.dev/path1': 6,
            'https://wagslane.dev/path2': 4,
            'https://wagslane.dev': 8,
            'https://wagslane.dev/path3': 2,
            'https://wagslane.dev/path4': 3,
        }
        const actual = sortPages(input);
        const expected = [
            ['https://wagslane.dev', 8],
            ['https://wagslane.dev/path1', 6],
            ['https://wagslane.dev/path2', 4],
            ['https://wagslane.dev/path4', 3],
            ['https://wagslane.dev/path3', 2],

        ]
        expect(actual).toEqual(expected);
    }
)
