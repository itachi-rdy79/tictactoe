const fs = require('fs');
const path = require('path');
const https = require('https');

const MOVIES_URL = 'https://raw.githubusercontent.com/santoshimz/pattukunte-pattucheera/main/public/static/movies.json';
const CONSTANTS_URL = 'https://raw.githubusercontent.com/santoshimz/pattukunte-pattucheera/main/src/utils/constants.js';
const METADATA_URL = 'https://raw.githubusercontent.com/santoshimz/pattukunte-pattucheera/main/public/static/meta-data.json';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node-GAP-Sync' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Failed to fetch ${url}: Status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function syncTollywoodData() {
  console.log('🔄 Fetching latest Tollywood movie data from upstream repository...');

  let movies = [];
  try {
    const rawMovies = await fetchUrl(MOVIES_URL);
    movies = JSON.parse(rawMovies);
    console.log(`✅ Fetched ${movies.length} movies from movies.json`);
  } catch (err) {
    console.warn(`⚠️ Could not fetch movies.json:`, err.message);
  }

  try {
    const rawConstants = await fetchUrl(CONSTANTS_URL);
    const match = rawConstants.match(/missingMovies\s*=\s*\[([\s\S]*?)\];/);
    if (match && match[1]) {
      const missingList = match[1]
        .split('\n')
        .map(line => line.trim().replace(/^["']|["'],?$/g, ''))
        .filter(Boolean);
      movies.push(...missingList);
      console.log(`✅ Extracted ${missingList.length} movies from missingMovies in constants.js`);
    }
  } catch (err) {
    console.warn(`⚠️ Could not parse missingMovies:`, err.message);
  }

  // Additional blockbuster & recent releases to ensure top-notch Tollywood library
  const essentialTollywood = [
    "Kalki 2898 AD", "Devara: Part 1", "Pushpa: The Rise", "Pushpa 2: The Rule",
    "RRR", "Baahubali: The Beginning", "Baahubali 2: The Conclusion", "Salaar: Part 1 – Ceasefire",
    "Magadheera", "Eega", "Athadu", "Pokiri", "Okkadu", "Khaleja", "Dookudu", "Businessman",
    "Sarileru Neekevvaru", "Guntur Kaaram", "Ala Vaikunthapurramuloo", "Arya", "Arya 2",
    "Race Gurram", "Julayi", "Rangasthalam", "Dhruva", "Srimanthudu", "Bharat Ane Nenu",
    "Geetha Govindam", "Arjun Reddy", "Jersey", "Hi Nanna", "Hanu-Man", "Tillu Square",
    "DJ Tillu", "Mathu Vadalara", "Mathu Vadalara 2", "Brochevarevarura", "Agent Sai Srinivasa Athreya",
    "Goodachari", "Major", "Evaru", "Kshanam", "Hit: The First Case", "Hit: The Second Case",
    "Mirchi", "Chatrapathi", "Varsham", "Nuvvostanante Nenoddantana", "Bommarillu", "Manam",
    "Ye Maaya Chesave", "Oopiri", "C/o Kancharapalem", "Pelli Choopulu", "Samajavaragamana",
    "Balagam", "Virupaksha", "Dasara", "Mangalavaaram", "Keedaa Cola", "MAD", "Sita Ramam",
    "Mahanati", "Shyam Singha Roy", "Ante Sundaraniki", "Leader", "Happy Days"
  ];
  movies.push(...essentialTollywood);

  // Normalize, deduplicate & sort
  const cleanSet = new Set();
  movies.forEach(m => {
    if (typeof m === 'string') {
      const clean = m.trim();
      if (clean.length > 0) cleanSet.add(clean);
    }
  });

  const sortedList = Array.from(cleanSet).sort((a, b) => a.localeCompare(b));
  console.log(`🎬 Total unique Tollywood movies compiled: ${sortedList.length}`);

  // Fetch today's metadata if available
  let todayMeta = null;
  try {
    const rawMeta = await fetchUrl(METADATA_URL);
    todayMeta = JSON.parse(rawMeta);
    console.log(`✅ Current upstream daily movie: "${todayMeta.movie}" (contributor: ${todayMeta.contributor || 'anonymous'})`);
  } catch (err) {
    console.warn(`⚠️ Could not fetch meta-data.json:`, err.message);
  }

  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outData = {
    updatedAt: new Date().toISOString(),
    count: sortedList.length,
    todayMeta: todayMeta || null,
    movies: sortedList
  };

  const jsonPath = path.join(dataDir, 'tollywood-movies.json');
  fs.writeFileSync(jsonPath, JSON.stringify(outData, null, 2), 'utf-8');
  console.log(`💾 Saved updated database to: ${jsonPath}`);
}

syncTollywoodData().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
