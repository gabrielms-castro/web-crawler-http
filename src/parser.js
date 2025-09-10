import { JSDOM } from 'jsdom'

export function getTextFromHTML (htmlBody) {
    const dom = new JSDOM(htmlBody)
    const text = dom.window.document.querySelector('html').textContent.trim()
    return text.replace(/\s+/g, " ")
}