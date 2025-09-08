import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
    if (process.argv.length < 3) {
        console.log("No Website provided");
        process.exit(1);
    }
    if (process.argv.length > 3) {
        console.log("Too many arguments provided");
        process.exit(1);
    }

    const baseURL = process.argv[2];
    console.log(`Starting crawl of ${baseURL}`);

    // Instance of Supabase DB and Supabase Storage
    // SupabaseClient is instantitated only once in a singleton pattern within client.js
    const database = new DatabaseManager();
    const storage = new StorageManager();

    const pages = await crawlPage(baseURL, baseURL, {}, database, storage) //1st baseURL is the starting point, 2nd is the current URL, {} is a new empty object to hold the pages
    printReport(pages);
}   

main();