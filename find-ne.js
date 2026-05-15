const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

const sIdx = content.indexOf('function ne(');
if (sIdx !== -1) {
    console.log("Found ne at " + sIdx + ". Snippet: " + content.substring(sIdx - 100, sIdx + 100));
} else {
    console.log("Could NOT find 'function ne('. Trying to find 'ne'...");
    
    // Check if ne is defined differently
    const altIdx = content.indexOf('ne=');
    if (altIdx !== -1) {
        console.log("Found ne= at " + altIdx + ". Snippet: " + content.substring(altIdx - 100, altIdx + 100));
    } else {
        console.log("Could not find any definition of ne.");
    }
}

// Where is ne used?
const useIdx = content.indexOf('(0,x.jsx)(ne');
if (useIdx !== -1) {
   console.log("Found ne usage at " + useIdx + ". Snippet: " + content.substring(useIdx - 100, useIdx + 100));
}
