import { crawlSiteAsync } from './concurrency.js';
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';
import { DatabaseManager } from './supabase/database.js';
import { StorageManager } from './supabase/storage.js';

async function main() {
    if (process.argv.length < 5) {
        console.log("Not enough arguments provided");
        console.log(
        "Usage: node src/main.js <baseURL> <maxConcurrency> <maxPages>",
        );
        process.exit(1);
    }

    if (process.argv.length > 5) {
        console.log("Too many arguments provided");
        process.exit(1);
    }

    const baseURL = process.argv[2];
    const maxConcurrency = Number(process.argv[3]);
    const maxPages = Number(process.argv[4]);
    
    if (!Number.isFinite(maxConcurrency) || maxConcurrency <= 0) {
        console.log("invalid maxConcurrency");
        process.exit(1);
    }
    if (!Number.isFinite(maxPages) || maxPages <= 0) {
        console.log("invalid maxPages");
        process.exit(1);
    }
    
    console.log(
        `[INFO] Starting crawl of: ${baseURL} (concurrency=${maxConcurrency}, maxPages=${maxPages})...`,
    );

    const pages = await crawlSiteAsync(baseURL, maxConcurrency, maxPages);    
    printReport(pages);
    
    process.exit(0);
}
// Instance of Supabase DB and Supabase Storage
// SupabaseClient is instantitated only once in a singleton pattern within client.js
// const database = new DatabaseManager();
// const storage = new StorageManager();
// const pages = await crawlPage(baseURL, baseURL, {}, database, storage) //1st baseURL is the starting point, 2nd is the current URL, {} is a new empty object to hold the pages
    


main();