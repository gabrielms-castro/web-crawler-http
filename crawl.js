const { JSDOM } = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`Crawling: ${currentURL}`);

    try {
        const resp = await fetch(currentURL);
        if (resp.status > 399) {
            console.log(`Error in fetch with status code ${resp.status} on page ${currentURL}`);
            return;
        }
        
        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html') ) {
            console.log(`Non HTML response. Content-Type: ${contentType}, on page: ${currentURL}`);
            return;

        }
        console.log(`resp text: ${await resp.text()}`);
    } catch (err) {
        console.log(`Error in fetch: ${err.message}, on page: ${currentURL}`);
    }
}

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
    getURLfromHTML,
    crawlPage,
}