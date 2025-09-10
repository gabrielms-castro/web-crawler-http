import { JSDOM } from 'jsdom'
import iconv from "iconv-lite";
import chardet from "chardet";
import { getTextFromHTML } from './parser.js';

export async function crawlPage(baseURL, currentURL, pages, database, storage) {
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
                "User-Agent": "Mozilla/5.0",
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
        
        const buffer = Buffer.from(await resp.arrayBuffer());
        let charset = chardet.detect(buffer) || getCharmapFromHTML(buffer.toString());
        const fixedHTMLEncoding = iconv.decode(buffer, charset);
        const normalizedText = normalizeText(fixedHTMLEncoding);

        // const htmlBody = await resp.text()
        const nextURLs = getURLFromHTML(normalizedText, currentURL)
        
        // upload HTML file to Supabase Storage
        let signedUrl
        try {
            let fileName = await resp.url
            const storageResponse = await storage.uploadFile(
                normalizeFileName(fileName),
                getTextFromHTML(normalizedText),
                "html-data",
                "text/html"
            )
            signedUrl = storageResponse.signedUrl
            console.log(`Storage Response: ${storageResponse.success}`)
        } catch (err) {
            console.log(`${err}`)
        }
        
        // persist data to Supabase Database
        try {
            const dbResponse = await database.insert(
                "urls_metadata", {
                    url: currentURL,
                    sb_storage_link: signedUrl
                }
            );
            console.log(`Database Response: ${dbResponse.success}`)
        } catch (err) {
            console.log(`${err}`)
        }    

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages, database, storage) 
        }

    } catch (err) {
        console.log(`Error in fetch: ${err}, on page: ${currentURL}`);
    }

    return pages;
}

export function getURLFromHTML(htmlBody, baseURL) {
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

export function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

export function normalizeFileName(fileName) {
    const fileExtension = fileName.replace(/(\.htm)$/g, ".html")

    const array = fileExtension.split("/")
    if (array.slice(-1)[0] === "") {
        return array.slice(-2)[0] + ".html"
    }
    return array.slice(-1).join()
}

export function normalizeText(text) {
  return text.normalize("NFKD");
}

export function getCharmapFromHTML(htmlBody) {
    const dom = new JSDOM(htmlBody)
    const metasContent = dom.window.document.querySelectorAll('meta')
    let charset;
    for (const meta of metasContent) {
        charset = meta.getAttribute('charset')
        if (!charset) continue;
        return charset
        
    }

}