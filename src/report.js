export function printReport(pages) {
    console.log("====================");
    console.log("REPORT");
    console.log("====================");
    
    const sortedPages = sortPages(pages);
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0];
        const hits = sortedPage[1];
        console.log(`Found ${hits} links to page https://${url}`)
    }
    
    console.log("====================");
    console.log("END REPORT");
    console.log("====================");

}

export function sortPages(pages) {
    // each URL maps to how many times that URL shows up as a link on the website
    const pagesArr = Object.entries(pages);
    pagesArr.sort((a, b) => {
        const aHits = a[1]
        const bHits = b[1]
        return b[1] - a[1]
    })
    return pagesArr;
}
