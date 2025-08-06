const { JSDOM } = require('jsdom')

function getURLfromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0,1) === '/') {
            // relative URL
            // URL object should throw and error if not valid. try/catch to handle it.
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`Invalid Relative URL: ${err.message}`);
            }
        } else {
            // absolulte URL
            // URL object should throw and error if not valid. try/catch to handle it.
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`Invalid Absolute URL: ${err.message}`);
            }
        }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLfromHTML
}