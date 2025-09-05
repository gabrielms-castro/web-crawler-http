const { crawlPage } = require('./crawl.js')
const { printReport } = require('./report.js')
const { supabaseClient } = require('./supabase_db/client')

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

    const supabase = supabaseClient()
    const pages = await crawlPage(baseURL, baseURL, {}, supabase) //1st baseURL is the starting point, 2nd is the current URL, {} is a new empty object to hold the pages
    printReport(pages);
}   

main();