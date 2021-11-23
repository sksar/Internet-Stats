import cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "fs";

fetch("https://bgp.he.net/ipv6-progress-report.cgi")
    .then(res => res.text())
    .then(html => {

        // Load the HTML into cheerio
        const $ = cheerio.load(html);

        // Extract Domains ipv6 and ipv4 data
        const domainsData = $("body > pre:nth-child(9)")
            .text()         // get the text
            .split("\n")    // split by lines
            .filter(x => x.includes("(")) // filter invalid lines (Checking by existance of a "(" )
            .map(row => {
                const [_, tld, domains, ipv4, ipv6] = row.split(/\s+/g);  // split by non-word characters
                return { tld, domains, ipv4, ipv6 }
            });

        fs.writeFileSync("domains.json", JSON.stringify(domainsData, null, 2));


    });

