import pLimit from "p-limit";

import { JSDOM } from 'jsdom'
import { normalizeURL } from "../utils/normalizers.js";
import { ignorePaths } from "../configs/config.js";

class ConcurrentCrawler {
    #baseURL;
    #pages;
    #limit;
    #maxPages;
    #shouldStop = false;
    #allTasks = new Set();
    #abortController = new AbortController();
    #visited = new Set();

    constructor(baseURL, maxConcurrency, maxPages=100) {
        this.#baseURL = baseURL;
        this.#pages = {};
        this.#limit = pLimit(maxConcurrency);
        this.#maxPages = Math.max(1, maxPages);
    }

    #addPageVisit(normalizedURL) {
        if (this.#shouldStop) return false;

        if (this.#pages[normalizedURL]) {
            this.#pages[normalizedURL]++;
        } else {
            this.#pages[normalizedURL] = 1;
        }

        if (this.#visited.has(normalizedURL)) {
            return false;
        }

        if (this.#visited.size >= this.#maxPages) {
            this.#shouldStop = true;
            console.log(`[INFO] Reached max pages limit of ${this.#maxPages}. Stopping crawl.`);
            this.#abortController.abort();
            return false;
        }

        this.#visited.add(normalizedURL)
        return true;
    }

    #getURLFromHTML(htmlBody, baseURL) {
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

    async #getHTML(currentURL) {
        const { signal } = this.#abortController;

        return await this.#limit(async () => {
            let res;
            try {
                res = await fetch(
                    currentURL, 
                    {
                        headers: { "User-Agent": "Mozilla/5.0" },
                        signal
                    }
                );
            } catch (err) {
                if (err?.name === "AbortError") {
                    throw new Error("Fetch aborted");
                }
                throw new Error(`Got Network error: ${err.message}`);
            }

            if (res.status > 399) {
                throw new Error(`Got HTTP error: ${res.status} ${res.statusText} - URL: ${currentURL}`);
            }

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("text/html")) {
                throw new Error(`Got non-HTML response: ${contentType} - URL: ${currentURL}`);
            }

            return res.text();
        });
    }

    async #crawlPage(currentURL) {
        if (this.#shouldStop) return;

        const currentURLObj = new URL(currentURL);
        const baseURLObj = new URL(this.#baseURL);

        if (currentURLObj.hostname !== baseURLObj.hostname) {
            return;
        }

        const normalizedURL = normalizeURL(currentURL);

        if (!this.#addPageVisit(normalizedURL)) {
            return
        }

        console.log(`[INFO] Crawling: ${currentURL}`);
        let html = "";
        try {
            html = await this.#getHTML(currentURL);
        } catch (err) {
            console.log(`[ERROR] ${err.message}`);
            return;
        }
        if (html.toLowerCase().includes("art. 1")) return;
        if (this.#shouldStop) return;

        const nextURLs = this.#getURLFromHTML(html, currentURL)
        
        const crawlPromises = [];

        for (const nextURL of nextURLs) {
            if (this.#shouldStop) break;

            const task = this.#crawlPage(nextURL)
            this.#allTasks.add(task);
            task.finally(() => this.#allTasks.delete(task));
            crawlPromises.push(task);
        }
        await Promise.all(crawlPromises);
    }

    async crawl() {
        const rootTask = this.#crawlPage(this.#baseURL);
        this.#allTasks.add(rootTask);
        try {
            await rootTask;
        } finally {
            this.#allTasks.delete(rootTask);
        }

        await Promise.allSettled(Array.from(this.#allTasks));
        
        //debug
        console.log(`[DEBUG] Crawling complete. Found ${Object.keys(this.#pages).length} unique pages.`);
        console.log(`[DEBUG] Visited ${this.#visited.size} pages.`);

        return this.#pages;
    }  
}

export async function crawlSiteAsync(baseURL, maxConcurrency = 5, maxPages=100) {
    const crawler = new ConcurrentCrawler(baseURL, maxConcurrency, maxPages);
    return await crawler.crawl();
}