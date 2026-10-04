const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let passed = 0;
  let failed = 0;

  function assert(cond, desc) {
    if (cond) {
      console.log(`  ✓ ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
    }
  }

  console.log('--- STARTING HOWFAR v10 AUTOMATED TEST SUITE ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  const filePath = 'file://' + path.resolve('/home/user/howfar-repo/prototypes/howfar-app-v10.html');
  await page.goto(filePath, { waitUntil: 'load' });

  assert(pageErrors.length === 0, `Zero JS console errors on load (got ${pageErrors.length})`);

  const rail = await page.$('#rail');
  assert(rail !== null, 'Left edge rail exists');

  const stories = await page.$$('.story');
  assert(stories.length >= 4, `Stories row renders avatars with orbit arcs (got ${stories.length})`);

  const posts = await page.$$('.post');
  assert(posts.length >= 2, `Deck renders feed posts (got ${posts.length})`);

  await browser.close();

  console.log(`\nTEST RESULTS: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
})();
