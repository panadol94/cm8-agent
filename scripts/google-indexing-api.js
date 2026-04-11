/**
 * Google Indexing API Script for cm8vvip.com
 * 
 * Prerequisites:
 * 1. Create Google Cloud Project: https://console.cloud.google.com/
 * 2. Enable "Indexing API": https://console.cloud.google.com/apis/library/indexing.googleapis.com
 * 3. Create Service Account: https://console.cloud.google.com/iam-admin/serviceaccounts
 * 4. Download JSON key file
 * 5. Add service account to Search Console as owner: [service-account]@[project].iam.gserviceaccount.com
 * 
 * Usage: node scripts/google-indexing-api.js
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://www.cm8vvip.com';
const KEY_FILE = process.env.GOOGLE_INDEXING_KEY_FILE || './google-indexing-key.json';

// Extract URLs from sitemap.ts
function getUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, '../src/app/sitemap.ts');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.ts not found!');
    return [];
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  
  // Extract static routes (paths)
  const pathMatches = content.matchAll(/path:\s*['"]([^'"]+)['"]/g);
  for (const match of pathMatches) {
    urls.push(`${SITE_URL}${match[1]}`);
  }
  
  // Extract blog slugs
  const slugMatches = content.matchAll(/['"]([a-z0-9-]+)['"],?\s*\n/g);
  const blogSlugs = [];
  for (const match of slugMatches) {
    const slug = match[1];
    // Filter for likely blog slugs (contain hyphens and are longer)
    if (slug.includes('-') && slug.length > 10) {
      blogSlugs.push(slug);
    }
  }
  
  // Add blog URLs
  blogSlugs.forEach(slug => {
    urls.push(`${SITE_URL}/blog/${slug}`);
  });
  
  // Remove duplicates and sort
  return [...new Set(urls)].sort();
}

// URLs to submit for indexing
const URLS_TO_SUBMIT = getUrlsFromSitemap();

async function submitUrlsForIndexing() {
  try {
    // Check if key file exists
    if (!fs.existsSync(KEY_FILE)) {
      console.error('❌ Google service account key file not found!');
      console.error(`   Expected at: ${KEY_FILE}`);
      console.error('\n📋 Setup Instructions:');
      console.error('1. Go to https://console.cloud.google.com/');
      console.error('2. Create a new project (or use existing)');
      console.error('3. Enable "Indexing API" at https://console.cloud.google.com/apis/library/indexing.googleapis.com');
      console.error('4. Create Service Account at https://console.cloud.google.com/iam-admin/serviceaccounts');
      console.error('   - Role: Owner');
      console.error('   - Create and download JSON key');
      console.error('5. Add service account email to Search Console as Owner');
      console.error('6. Place the JSON key file in this directory as "google-indexing-key.json"');
      process.exit(1);
    }

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const client = await auth.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    console.log('🚀 Starting Google Indexing API submission...\n');

    const results = [];

    for (const url of URLS_TO_SUBMIT) {
      try {
        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });

        results.push({
          url,
          status: '✅ SUCCESS',
          timestamp: new Date().toISOString(),
        });

        console.log(`✅ Submitted: ${url}`);
        
        // Rate limit: 200 requests per day per property
        // Wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          url,
          status: '❌ FAILED',
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        console.error(`❌ Failed: ${url} - ${error.message}`);
      }
    }

    // Save results
    const resultsFile = path.join(__dirname, 'indexing-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    console.log('\n📊 Summary:');
    console.log(`Total URLs: ${URLS_TO_SUBMIT.length}`);
    console.log(`Successful: ${results.filter(r => r.status === '✅ SUCCESS').length}`);
    console.log(`Failed: ${results.filter(r => r.status === '❌ FAILED').length}`);
    console.log(`\nResults saved to: ${resultsFile}`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Check for dry-run mode
  if (process.argv.includes('--dry-run') || process.argv.includes('-d')) {
    console.log('🔍 DRY RUN - URLs that will be submitted:');
    console.log('='.repeat(60));
    URLS_TO_SUBMIT.forEach((url, i) => console.log(`${i + 1}. ${url}`));
    console.log('='.repeat(60));
    console.log(`\nTotal URLs: ${URLS_TO_SUBMIT.length}`);
    console.log('\nTo submit for real, run: node scripts/google-indexing-api.js');
    console.log('Make sure google-indexing-key.json exists first!');
    process.exit(0);
  }
  submitUrlsForIndexing();
}

export { submitUrlsForIndexing, getUrlsFromSitemap };
