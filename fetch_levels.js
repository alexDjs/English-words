// Fetches Oxford 3000/5000 word list with CEFR levels and updates words.js
const https = require('https');
const fs = require('fs');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching Oxford 3000/5000 word list...');
  const html = await fetchPage('https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000');

  // Parse word-level pairs from the page HTML
  // Pattern: <a ...>word</a> ... A1/A2/B1/B2/C1
  const cefrMap = {};

  // Match patterns like: "word" followed by CEFR level
  const pattern = /\[([^\]]+)\]\(https:\/\/www\.oxfordlearnersdictionaries\.com\/definition\/english\/[^\)]+\)\s+(?:[\w ]+\s+)?([AB][12]|C1)/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const word = match[1].toLowerCase().trim();
    const level = match[2];
    // Keep the highest level seen for each word (A1 < A2 < B1 < B2 < C1)
    const order = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
    if (!cefrMap[word] || order[level] < order[cefrMap[word]]) {
      cefrMap[word] = level;
    }
  }

  // Also try HTML anchor text pattern from rendered content
  const htmlPattern = /<a[^>]*>([^<]+)<\/a>[^A-Z]*([AB][12]|C1)\s*\n/g;
  while ((match = htmlPattern.exec(html)) !== null) {
    const word = match[1].toLowerCase().trim();
    const level = match[2];
    const order = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
    if (!cefrMap[word] || order[level] < order[cefrMap[word]]) {
      cefrMap[word] = level;
    }
  }

  const count = Object.keys(cefrMap).length;
  console.log(`Parsed ${count} word-level pairs from Oxford`);

  if (count < 100) {
    console.log('WARNING: Too few words parsed. Dumping sample of HTML for debugging:');
    console.log(html.substring(0, 2000));
    return;
  }

  // Update words.js
  const content = fs.readFileSync('words.js', 'utf8');

  // Extract header
  const headerMatch = content.match(/^([\s\S]*?)(const WORDS\s*=)/);
  const header = headerMatch ? headerMatch[1] : '';

  // Extract trailer (sort/dedup code after the array)
  const trailerMatch = content.match(/\];\s*\n([\s\S]*)/);
  const trailer = trailerMatch ? '\n' + trailerMatch[1] : '';

  // Extract array lines
  const startIdx = content.indexOf('const WORDS = [');
  const endLine = content.indexOf('\n];', startIdx);
  const arrayContent = content.slice(startIdx + 'const WORDS = ['.length, endLine);

  const lines = arrayContent.split('\n').filter(l => l.trim());
  let assigned = 0;
  const dist = {};

  const updatedLines = lines.map(line => {
    const mw = line.match(/\{w:"([^"]+)"/);
    if (!mw) return line;
    const word = mw[1].toLowerCase();

    // Strip existing l field
    let clean = line.replace(/,l:"[^"]+"\}/, '}').replace(/,l:"[^"]+",/, ',');

    const level = cefrMap[word];
    if (level) {
      assigned++;
      dist[level] = (dist[level] || 0) + 1;
      return clean.replace(/\}(\s*,?)$/, `,l:"${level}"}$1`);
    }
    return clean;
  });

  console.log(`Assigned levels to ${assigned}/${lines.length} words`);
  console.log('Distribution:', dist);

  const output = `${header}const WORDS = [\n${updatedLines.join('\n')}\n];${trailer}`;
  fs.writeFileSync('words.js', output, 'utf8');
  console.log('words.js updated!');
}

main().catch(console.error);
