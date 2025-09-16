export function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

export function normalizeFileName(fileName) {
    const fileExtension = fileName.replace(/(\.htm|\.html)$/g, ".txt")

    const array = fileExtension.split("/")
    if (array.slice(-1)[0] === "") {
        return array.slice(-2)[0] + ".txt"
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