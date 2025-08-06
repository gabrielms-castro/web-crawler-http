const { crawlPage } = require('./crawl.js')

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

    const pages = await crawlPage(baseURL, baseURL, {}) //1st baseURL is the starting point, 2nd is the current URL, {} is a new empty object to hold the pages
    for (const page of Object.entries(pages)) {
        console.log(page);
    }
}   

main();