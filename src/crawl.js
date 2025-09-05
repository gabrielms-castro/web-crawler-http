const { JSDOM } = require('jsdom');
const { insertData } = require('./supabase_db/insert_into')

async function crawlPage(baseURL, currentURL, pages, dbClient) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }
    
    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }
    pages[normalizedCurrentURL] = 1;

    console.log(`Crawling: ${currentURL}`);
    
    let resp;
    try {
        resp = await fetch(currentURL,{
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        if (resp.status > 399) {
            console.log(`Error in fetch with status code ${resp.status} on page ${currentURL}`);
            return pages; 
        }
        
        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.log(`Non HTML response. Content-Type: ${contentType}, on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await resp.text();
        const nextURLs = getURLFromHTML(htmlBody, currentURL)

        // persist data into database
        try {
            const dbResponse = await insertData(dbClient, { full_url: currentURL })
            console.log(`${dbResponse.status}: ${dbResponse.statusText}`)
        } catch (err) {
            console.log(`${err}`)
        }    

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages, dbClient);
        }

    } catch (err) {
        console.log(`Error in fetch: ${err}, on page: ${currentURL}`);
    }

    return pages;
}

function getURLFromHTML(htmlBody, baseURL) {
    // withBar: if true, return URLs with trailing slash; if false, return URLs without trailing slash

    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    
    for (const linkElement of linkElements) {
        const hrefRaw = linkElement.getAttribute('href');
        if (!hrefRaw) continue;
        if (hrefRaw.includes("#")) continue;

        try {
            const resolved = new URL(hrefRaw, baseURL);

            if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') continue;

            urls.push(resolved.href);
        } catch (err) {
            console.log(`Invalid Absolute URL: ${err.message}`);
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
    getURLFromHTML,
    crawlPage,
}