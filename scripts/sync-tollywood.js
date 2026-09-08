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

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node-GAP-Sync' } }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Failed to fetch buffer ${url}: Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
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

  // Ensure data and daily directories exist
  const dataDir = path.join(__dirname, '..', 'data');
  const dailyDir = path.join(dataDir, 'daily');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dailyDir)) fs.mkdirSync(dailyDir, { recursive: true });

  // Calculate today's exact Tollywood day count
  const origin = new Date("2022-05-22T18:30:00.000Z");
  const diffSec = (Date.now() - origin.getTime()) / 1000;
  const currentDay = Math.max(1, Math.floor(diffSec / 86400));
  console.log(`📅 Current Tollywood Day Count: #${currentDay}`);

  const S3_BASE = 'https://pattukunte-pattucheera-movies.s3.amazonaws.com';
  let todayMeta = null;

  // 1. Fetch metadata from official S3 storage
  try {
    const s3MetaRaw = await fetchUrl(`${S3_BASE}/${currentDay}/meta-data.json`);
    todayMeta = JSON.parse(s3MetaRaw);
    todayMeta.day = currentDay;
    fs.writeFileSync(path.join(dailyDir, 'meta-data.json'), JSON.stringify(todayMeta, null, 2), 'utf-8');
    console.log(`✅ Saved today's (#${currentDay}) movie metadata: "${todayMeta.movie}"`);
    if (todayMeta.movie && !cleanSet.has(todayMeta.movie)) {
      sortedList.push(todayMeta.movie);
      sortedList.sort((a, b) => a.localeCompare(b));
    }
  } catch (err) {
    console.warn(`⚠️ Could not fetch S3 metadata for day ${currentDay}:`, err.message);
  }

  // 2. Download all 5 movie scene stills for 100% offline play
  console.log(`🖼️ Downloading 5 daily movie still frames from S3 for offline storage...`);
  for (let f = 1; f <= 5; f++) {
    try {
      const imgUrl = `${S3_BASE}/${currentDay}/${f}.jpg`;
      const imgBuf = await fetchBuffer(imgUrl);
      fs.writeFileSync(path.join(dailyDir, `${f}.jpg`), imgBuf);
      console.log(`  ✓ Frame ${f}/5 saved: ${imgBuf.length} bytes`);
    } catch (err) {
      console.warn(`  ⚠️ Could not download frame ${f}:`, err.message);
    }
  }

  const outData = {
    updatedAt: new Date().toISOString(),
    day: currentDay,
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
