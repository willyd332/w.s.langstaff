const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { JSDOM } = require('jsdom');

const inputFile = path.join(__dirname, 'publications.csv');
const indexPath = path.join(__dirname, 'index.html');

// HTML template for each work item
const workItemTemplate = (link, image, journal, title, date) => `
<div class="work-item">
    <a target="_blank" href="${link}">
        <span class="dash">-</span> <span class="article-title">${title}</span> <span class="dash">—</span> <span class="journal-name">${journal}</span> <span class="dash">—</span> <span class="publication-date">${date}</span>
    </a>
</div>
`;

// Read and parse the CSV file
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Generate the HTML content from the CSV data
const generateWorkItems = (data) => {
    return data.map(row => 
        workItemTemplate(row.link, row.image, row.journal, row.title, row.date)
    ).join('');
};

// Update the index.html file with the new work items using DOM manipulation
const updateHTMLFile = (filePath, newContent) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        const dom = new JSDOM(data);
        const document = dom.window.document;
        const workSection = document.querySelector('#work');

        workSection.innerHTML += newContent;

        fs.writeFile(filePath, dom.serialize(), 'utf8', (err) => {
            if (err) throw err;
            console.log('index.html has been updated!');
        });
    });
};

// Main function to execute the script
const main = async () => {
    try {
        const data = await parseCSV(inputFile);
        const workItems = generateWorkItems(data);
        updateHTMLFile(indexPath, workItems);
    } catch (error) {
        console.error('Error:', error);
    }
};

main();
