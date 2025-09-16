import pLimit from "p-limit";

import { normalizeURL } from "../utils/normalizers.js";
import { normalizeText, normalizeFileName } from "../utils/normalizers.js";
import { getTextFromHTML, getURLFromHTML } from "../utils/parser.js";
import { DatabaseManager } from "../supabase/database.js";
import { StorageManager } from "../supabase/storage.js";

class ConcurrentCrawler {
    #baseURL;
    #pages;
    #limit;
    #maxPages;
    #shouldStop = false;
    #allTasks = new Set();
    #visited = new Set();
    #abortController = new AbortController();
    #database = new DatabaseManager();
    #storage = new StorageManager();

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

            const html = await res.text();

            return {
                html,
                resURL: res.url
            }
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
        let html, resURL;
        try {
            ({ html, resURL } = await this.#getHTML(currentURL));
        } catch (err) {
            console.log(`[ERROR] ${err.message}`);
            return;
        }

        if (html.toLowerCase().includes("art. 1")) return;
        if (this.#shouldStop) return;

        
        const nextURLs = getURLFromHTML(html, currentURL)
       
        // clean file name
        const normalizedFileName = normalizeFileName(resURL)

        let signedUrl;
        try {
            const storageResponse = await this.#storage.uploadFile(
                normalizedFileName,
                html,
                "html-data",
                "text/html"
            )
            signedUrl = storageResponse.signedUrl
            console.log(`[INFO] Storage Response: ${currentURL} - ${storageResponse.success ? "Success" : "Failed"}`)
        } catch (err) {
            throw new Error(`Storage error: ${err.message}`);
        }  
        
        // persist data to Supabase Database
        try {
            const dbResponse = await this.#database.insert(
                "urls_metadata", {
                    url: currentURL,
                    sb_storage_link: signedUrl
                }
            );
            console.log(`[INFO] Database Response: ${currentURL} - ${dbResponse.success ? "Success" : "Failed"}`)
        } catch (err) {
            throw new Error(`Database error: ${err.message}`);
        }            

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