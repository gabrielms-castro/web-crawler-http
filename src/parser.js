import { JSDOM } from 'jsdom'

export function getTextFromHTML(htmlBody) {
    const dom = new JSDOM(htmlBody)

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