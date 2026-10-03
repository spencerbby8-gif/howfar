const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  let passed = 0;
  let failed = 0;
  const errors = [];

  function assert(condition, desc) {
    if (condition) {
      console.log(`  ✓ ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
      failed++;
      errors.push(desc);
    }
  }

  console.log('--- STARTING HOWFAR v3 (v9) AUTOMATED TEST SUITE ---');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push(msg.text());
  });

  const filePath = 'file://' + path.resolve(__dirname, '../prototypes/howfar-app-v9.html');
  await page.goto(filePath, { waitUntil: 'load' });

  // 1. Initial Load & Errors Check
  assert(pageErrors.length === 0, `Zero JS console errors on load (got ${pageErrors.length})`);

  // 2. Edge Rail Navigation Checks
  const railExists = await page.$('#edge-rail') !== null;
  assert(railExists, 'Edge rail exists on the left');

  const tabCount = await page.$$eval('.rail-item', els => els.length);
  assert(tabCount === 5, `Rail has 5 tabs (Home, Now, Camera, Alerts, Profile) - got ${tabCount}`);

  const activeTab = await page.$eval('.rail-item.active', el => el.getAttribute('data-tab'));
  assert(activeTab === 'home', `Default active tab is 'home' (got ${activeTab})`);

  // Test Rail Collapse / Expand
  await page.click('#rail-collapse-btn');
  const isCollapsed = await page.$eval('#edge-rail', el => el.classList.contains('collapsed'));
  assert(isCollapsed, 'Clicking chevron collapses the edge rail');

  await page.click('#rail-handle');
  const isExpanded = await page.$eval('#edge-rail', el => !el.classList.contains('collapsed'));
  assert(isExpanded, 'Clicking handle expands the edge rail');

  // 3. Tab Routing Checks
  // Test Now Tab
  await page.click('#tab-btn-now');
  const nowActive = await page.$eval('#scr-now', el => el.classList.contains('active'));
  const railAutoCollapsedInNow = await page.$eval('#edge-rail', el => el.classList.contains('collapsed'));
  assert(nowActive, 'Now tab activates #scr-now screen');
  assert(railAutoCollapsedInNow, 'Entering Now auto-collapses rail for full immersion');

  // Test Camera Tab (expand rail first if collapsed, simulating user expanding rail or swipe)
  if (railAutoCollapsedInNow) {
    await page.click('#rail-handle');
  }
  await page.click('#tab-btn-camera');
  const camActive = await page.$eval('#scr-camera', el => el.classList.contains('active'));
  assert(camActive, 'Camera tab activates #scr-camera screen');

  // Test Alerts Tab
  await page.click('#tab-btn-alerts');
  const alertsActive = await page.$eval('#scr-alerts', el => el.classList.contains('active'));
  const alertsCount = await page.$$eval('.alert-card', els => els.length);
  assert(alertsActive, 'Alerts tab activates #scr-alerts screen');
  assert(alertsCount === 3, `Alerts screen shows 3 calm alerts (got ${alertsCount})`);

  // Test Profile Tab
  await page.click('#tab-btn-profile');
  const profActive = await page.$eval('#scr-profile', el => el.classList.contains('active'));
  const kmVal = await page.$eval('#prof-km-val', el => el.textContent.trim());
  assert(profActive, 'Profile tab activates #scr-profile screen');
  assert(kmVal === '18,420', `Profile renders private stats (KM: ${kmVal})`);

  const strataCount = await page.$$eval('.stratum-layer', els => els.length);
  assert(strataCount === 3, `The Ground archive shows 3 strata layers (got ${strataCount})`);

  // Switch back to Home
  await page.click('#tab-btn-home');
  const homeActive = await page.$eval('#scr-home', el => el.classList.contains('active'));
  assert(homeActive, 'Returns to Home screen');

  // 4. Stories Row & Orbit Rings Checks
  const storyCirclesCount = await page.$$eval('.story-circle', els => els.length);
  assert(storyCirclesCount === 5, `Stories row has 5 friend circles (got ${storyCirclesCount})`);

  const orbitArcsCount = await page.$$eval('.story-orbit-svg .orbit-arc', els => els.length);
  assert(orbitArcsCount === 5, `Stories avatars wear custom orbit rings (got ${orbitArcsCount})`);

  // Test Story Open (Amara - Photo Still)
  await page.click('.story-circle[data-user="amara"]');
  const storyViewerOpen = await page.$eval('#story-viewer-stage', el => el.classList.contains('open'));
  const storyAuthor = await page.$eval('#story-view-author', el => el.textContent.trim());
  const storyBadge = await page.$eval('#story-badge-type', el => el.textContent.trim());
  const fuseHidden = await page.$eval('#story-fuse-wrap', el => el.style.display === 'none');

  assert(storyViewerOpen, 'Clicking story circle opens story viewer stage');
  assert(storyAuthor === 'amara', `Story viewer shows author 'amara' (got ${storyAuthor})`);
  assert(storyBadge.includes('Photo Still'), `Amara story is Photo Still (got ${storyBadge})`);
  assert(fuseHidden, 'Photo stills have NO fuse timer (kept moments)');

  // Test Story Close
  await page.click('#story-close-btn');
  const storyViewerClosed = await page.$eval('#story-viewer-stage', el => !el.classList.contains('open'));
  assert(storyViewerClosed, 'Story viewer closes via close button');

  // Test Story Open (Tunde - Moment with Fuse)
  await page.click('.story-circle[data-user="tunde"]');
  const tundeBadge = await page.$eval('#story-badge-type', el => el.textContent.trim());
  const fuseVisible = await page.$eval('#story-fuse-wrap', el => el.style.display === 'block');
  assert(tundeBadge.includes('Moment'), `Tunde story is Moment (got ${tundeBadge})`);
  assert(fuseVisible, 'Moments have active burning halo fuse');
  await page.click('#story-close-btn');

  // 5. Feed Cards, Receipts & Flare Checks
  const feedCardsCount = await page.$$eval('.feed-card', els => els.length);
  assert(feedCardsCount >= 2, `Home feed has posts with receipts (got ${feedCardsCount})`);

  const receiptText = await page.$eval('#post-card-1 .card-receipt', el => el.textContent.trim());
  assert(receiptText.includes('warri') && receiptText.includes('2 km'), `Receipt contains origin & distance (${receiptText})`);

  // 6. Comments Section — Behind the Post (Flagship Gesture)
  await page.click('#post-card-1 .drag-center-indicator');
  const commentsOpen = await page.$eval('#comments-overlay', el => el.classList.contains('open'));
  const cardDocked = await page.$eval('#post-card-1', el => el.classList.contains('docked-for-comments'));
  assert(commentsOpen, 'Comments overlay opens behind the post');
  assert(cardDocked, 'Post card docks (scaled & blurred) while comments cascade');

  // Close comments
  await page.click('#comments-close-btn');
  const commentsClosed = await page.$eval('#comments-overlay', el => !el.classList.contains('open'));
  const cardUndocked = await page.$eval('#post-card-1', el => !el.classList.contains('docked-for-comments'));
  assert(commentsClosed, 'Comments overlay closes');
  assert(cardUndocked, 'Post card restores to full size upon comment close');

  // 7. Video Comments & Reaction Bubbles Checks
  const bubblesCount = await page.$$eval('.reaction-bubble', els => els.length);
  assert(bubblesCount >= 3, `Reaction bubbles float on post edges (got ${bubblesCount})`);

  // Tap reaction bubble -> PiP overlay
  await page.click('.reaction-bubble[data-reaction-user="tunde"]');
  const pipVisible = await page.$eval('#pip-reaction-stage', el => window.getComputedStyle(el).display === 'flex');
  const pipUser = await page.$eval('#pip-user-tag', el => el.textContent.trim());
  assert(pipVisible, 'Tapping reaction bubble opens Picture-in-Picture (PiP) video reaction player');
  assert(pipUser.includes('tunde'), `PiP player shows @tunde reacting (got ${pipUser})`);

  await page.click('#pip-close-btn');
  const pipClosed = await page.$eval('#pip-reaction-stage', el => window.getComputedStyle(el).display === 'none');
  assert(pipClosed, 'PiP reaction player closes cleanly');

  // 8. In-Comments Video Reaction Creation & Text Commenting (ReplyMate UI)
  await page.click('#post-card-1 .drag-center-indicator');
  const initialCommentCount = await page.$$eval('.comment-item', els => els.length);

  // Verify ReplyMate Send button "➤" and Composer layout
  const sendBtnText = await page.$eval('#btn_manual_send', el => el.textContent.trim());
  assert(sendBtnText === '➤', `ReplyMate Send button "➤" exists (got ${sendBtnText})`);
  
  // Test Video Comment creation (+ Video)
  await page.click('#btn_video_react');
  const afterVideoCount = await page.$$eval('.comment-item', els => els.length);
  const pipAfterRec = await page.$eval('#pip-reaction-stage', el => window.getComputedStyle(el).display === 'flex');
  assert(afterVideoCount === initialCommentCount + 1, 'Recording video reaction creates a new video reaction bubble');
  assert(pipAfterRec, 'Video reaction preview plays immediately in PiP mode');
  await page.click('#pip-close-btn');

  // Test Text Comment posting
  await page.type('#comment-input', 'This looks incredible live!');
  await page.click('#btn_manual_send');
  const afterTextCount = await page.$$eval('.comment-item', els => els.length);
  const lastCommentText = await page.$$eval('.comment-text', els => els[els.length - 1].textContent);
  assert(afterTextCount === afterVideoCount + 1, 'Sending text comment adds ReplyMate bubble out to stream');
  assert(lastCommentText.includes('This looks incredible live!'), `Comment text matches input (${lastCommentText})`);
  await page.click('#comments-close-btn');

  // 9. Camera Creation & Container-Transform Release
  await page.click('#tab-btn-camera');
  await page.type('#cam-caption-input', 'Testing release from Port Harcourt');
  await page.click('#cam-publish-btn');
  
  // Verify redirected to Home and new post prepended
  const isBackOnHome = await page.$eval('#scr-home', el => el.classList.contains('active'));
  const firstPostReceipt = await page.$eval('#feed-stream .feed-card:first-child .card-receipt', el => el.textContent.trim());
  assert(isBackOnHome, 'Publishing releases post and switches back to Home screen');
  assert(firstPostReceipt.includes('port harcourt') && firstPostReceipt.includes('0 km'), `New post prepended with origin receipt (${firstPostReceipt})`);

  // 10. Voice Comet Reply inside Stories
  await page.click('.story-circle[data-user="kelechi"]');
  const cometReplyBtnExists = await page.$('#story-voice-reply-btn') !== null;
  assert(cometReplyBtnExists, 'Voice comet reply button exists in story viewer');
  await page.click('#story-close-btn');

  // 11. Responsive Viewport Fits
  const viewports = [
    { w: 480, h: 800, name: '480px standard' },
    { w: 360, h: 640, name: '360px compact' },
    { w: 320, h: 568, name: '320px narrow' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.w, height: vp.h });
    const overflowX = await page.evaluate(() => document.body.scrollWidth > window.innerWidth);
    assert(!overflowX, `No horizontal scroll overflow at ${vp.name} (${vp.w}x${vp.h})`);
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
})();
