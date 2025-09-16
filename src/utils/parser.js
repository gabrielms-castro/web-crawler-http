import { JSDOM } from 'jsdom'
import { ignorePaths } from '../configs/config.js';

export function getURLFromHTML(htmlBody, baseURL) {
    // withBar: if true, return URLs with trailing slash; if false, return URLs without trailing slash

    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    
    for (const linkElement of linkElements) {
        const hrefRaw = linkElement.getAttribute('href');
        if (!hrefRaw) continue;
        if (hrefRaw.includes("#")) continue;
        if (hrefRaw.includes(".doc")) continue;
        if (hrefRaw.includes(".mp4")) continue;
        if (hrefRaw.includes(".pdf")) continue;
        if (ignorePaths.has(hrefRaw)) continue;

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

export function getTextFromHTML(htmlBody) {
    const stripedHTML = stripScriptsFromHTML(htmlBody)
    const dom = new JSDOM(stripedHTML)
    const text = dom.window.document.querySelector('html').textContent.trim()
    return text.replace(/\s+/g, " ")
}

export function stripScriptsFromHTML(htmlBody) {
    const dom = new JSDOM(htmlBody);
    const scripts = dom.window.document.querySelectorAll('script');
    for (const script of scripts) {
        script.remove();
    }

    const styles = dom.window.document.querySelectorAll('style');
    for (const style of styles) {
        style.remove();
    }
    return dom.serialize()
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
