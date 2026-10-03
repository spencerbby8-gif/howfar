/* how far — the sky · full browser test suite */
const puppeteer = require('puppeteer');
const FILE = 'file://' + require('path').join(__dirname, '../prototypes/howfar-sky-v1.html');

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, extra){
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (extra ? ' — ' + extra : '')); console.log('  ✗ FAIL: ' + name + (extra ? ' — ' + extra : '')); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 480, height: 900 });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/i.test(m.text())) errors.push('console: ' + m.text()); });

  const active = () => page.evaluate(() => { const a = document.querySelector('.screen.active'); return a ? a.id : null; });
  const txt = sel => page.$eval(sel, e => e.textContent).catch(() => null);
  const exists = sel => page.$(sel).then(Boolean);
  const count = sel => page.$$eval(sel, es => es.length);
  const toastTxt = () => txt('#toast').catch(() => null);
  const fuseP = () => page.$eval('#fuse-arc', e => parseFloat(e.getAttribute('data-p') || '0')).catch(() => -1);
  async function hold(sel, ms){
    await page.hover(sel);
    await page.mouse.down();
    await sleep(ms);
    await page.mouse.up();
  }
  async function lightByName(n){
    return page.evaluateHandle((name) => {
      const els = document.querySelectorAll('#sky-stage .light');
      for (const el of els) if (el.querySelector('.lname').textContent === name) return el;
      return null;
    }, n);
  }
  async function clickLight(n){
    const h = await lightByName(n);
    await h.asElement().click();
  }

  await page.goto(FILE, { waitUntil: 'load' });
  console.log('— boot: the sky —');
  ok('splash first', (await active()) === 'scr-splash');
  await sleep(2600);
  ok('splash enters the sky', (await active()) === 'scr-sky');
  ok('status line: lights up tonight', ((await txt('#sky-status')) || '').includes('4 lights up tonight'));
  ok('anticipation: 1 traveling to you', ((await txt('#sky-status')) || '').includes('1 traveling to you'));
  ok('you are a light at the center', await exists('#sky-stage .light.you'));
  ok('5 friends in the sky', (await count('#sky-stage .light:not(.you)')) === 5);
  ok('the drifted one is dim', (await page.$eval('.light[data-id="chidi"]', e => e.classList.contains('dimlit'))));
  ok('constellation lines drawn', (await count('#constellation line')) >= 8);
  ok('scope starts near', (await page.$eval('#scr-sky', e => e.getAttribute('data-scope'))) === 'near');
  ok('lights breathe', (await page.$eval('.light[data-id="amara"] .orb', e => getComputedStyle(e).animationName)) === 'breathe');
  ok('incoming light announced', ((await txt('#incoming .inc-label')) || '').includes('london') && ((await txt('#incoming .inc-label')) || '').includes('arrives in'));

  console.log('— zoom is the feed —');
  await page.click('#scope-btn');
  await sleep(800);
  ok('zoom out → city', (await page.$eval('#scr-sky', e => e.getAttribute('data-scope'))) === 'city');
  const cityVis = await page.$$eval('.far-light[data-tier="city"]', es => es.every(e => getComputedStyle(e).opacity === '1'));
  ok('city horizon lights visible with receipts', cityVis && (await count('.far-light[data-tier="city"]')) === 3);
  ok('receipts read as distance', ((await txt('.far-light[data-id="f-lagos"] .fname')) || '').includes('312 km'));
  await page.click('#scope-btn');
  await sleep(800);
  ok('zoom out → world', (await page.$eval('#scr-sky', e => e.getAttribute('data-scope'))) === 'world');
  ok('the whole world is visible', (await page.$$eval('.far-light', es => es.every(e => getComputedStyle(e).opacity === '1'))) && (await count('.far-light')) === 6);
  await page.click('#scope-btn');
  await sleep(800);
  ok('zoom back → near, horizon gone', (await page.$eval('#scr-sky', e => e.getAttribute('data-scope'))) === 'near' &&
    (await page.$$eval('.far-light', es => es.every(e => getComputedStyle(e).opacity === '0'))));
  ok('wheel zooms too', await (async () => {
    await page.hover('#sky-status');
    await page.mouse.wheel({ deltaY: -40 });
    await sleep(700);
    return (await page.$eval('#scr-sky', e => e.getAttribute('data-scope'))) === 'city';
  })());
  await page.click('#scope-btn'); await page.click('#scope-btn'); /* back to near */
  await sleep(700);

  console.log('— far light: catch it —');
  await page.click('#scope-btn'); /* city */
  await sleep(800);
  await page.click('.far-light[data-id="f-lagos"]');
  ok('receipt dialog', ((await txt('#dialog .dtitle')) || '') === 'a light from lagos');
  ok('receipt says distance, not algorithm', ((await txt('#dialog .pick .pd')) || '').includes('traveled 312 km'));
  await (await page.$$('#dialog .pick'))[0].click(); /* Catch it */
  await sleep(600);
  ok('catching opens the bloom', (await active()) === 'scr-bloom' && ((await txt('#bloom-who')) || '') === 'a stranger');
  ok('stranger story plays', ((await txt('#bloom-cap')) || '').includes('lagos'));
  await page.click('#bloom-close');
  ok('back to the sky', (await active()) === 'scr-sky');
  await page.click('#scope-btn'); await page.click('#scope-btn'); await sleep(700); /* near */

  console.log('— the bloom: warp, fuse, drift —');
  await clickLight('amara');
  await sleep(700);
  ok('warp opens the story', (await active()) === 'scr-bloom' && ((await txt('#bloom-who')) || '') === 'amara');
  ok('segment 0 playing', (await page.$eval('#bloom-media', e => e.getAttribute('data-seg'))) === '0');
  ok('no progress bars — a fuse', await exists('#fuse-arc'));
  await sleep(1500);
  const p1 = await fuseP();
  ok('the fuse burns down', p1 > 0.05 && p1 < 0.9, 'p=' + p1);

  console.log('— anchor: the sky obeys your hand —');
  await page.mouse.move(240, 450);
  await page.mouse.down();
  await sleep(750);
  ok('holding sends a flare at 600ms', ((await toastTxt()) || '').includes('flare sent'));
  ok('anchored while held', (await page.$eval('#scr-bloom', e => e.classList.contains('anchored'))));
  const pa = await fuseP();
  await sleep(1000);
  const pb = await fuseP();
  ok('the fuse freezes while anchored', Math.abs(pb - pa) < 0.02, 'pa=' + pa + ' pb=' + pb);
  await page.mouse.up();
  await sleep(700);
  const pc = await fuseP();
  ok('release resumes the drift', pc > pb + 0.03, 'pb=' + pb + ' pc=' + pc);

  console.log('— drift to the next moment —');
  await sleep(4600);
  ok('segment drifts in when the fuse is spent', (await page.$eval('#bloom-media', e => e.getAttribute('data-seg'))) === '1');
  ok('amara\'s sky light got the flare', (await page.$eval('.light[data-id="amara"]', e => e.classList.contains('flared'))));
  await page.click('#bloom-close');

  console.log('— throw physics —');
  await clickLight('tunde');
  await sleep(700);
  ok('tunde\'s story opens', (await active()) === 'scr-bloom' && ((await txt('#bloom-who')) || '') === 'tunde');
  await page.mouse.move(200, 450);
  await page.mouse.down();
  await page.mouse.move(320, 450, { steps: 2 });
  await page.mouse.move(460, 440, { steps: 2 });
  await page.mouse.up();
  ok('a flick throws the story away', (await active()) === 'scr-sky' && ((await toastTxt()) || '').includes('thrown'));

  console.log('— pull back = rewind —');
  await clickLight('kelechi');
  await sleep(700);
  ok('kelechi\'s story opens', (await active()) === 'scr-bloom');
  await sleep(1200);
  const pk = await fuseP();
  ok('fuse burning', pk > 0.05, 'p=' + pk);
  await page.mouse.move(240, 400);
  await page.mouse.down();
  await page.mouse.move(240, 470, { steps: 3 });
  await page.mouse.move(240, 570, { steps: 3 });
  await page.mouse.up();
  await sleep(400);
  ok('pull down rewinds the moment', ((await toastTxt()) || '').includes('pulled back'));
  const pk2 = await fuseP();
  ok('the fuse starts over', pk2 < pk && pk2 < 0.2, 'pk=' + pk + ' pk2=' + pk2);
  await page.click('#bloom-close');

  console.log('— reply = a shooting star —');
  await clickLight('tunde');
  await sleep(700);
  await page.click('#reply-btn');
  ok('reply strip opens', (await page.$eval('#reply-strip', e => e.classList.contains('show'))));
  await hold('#reply-hold', 380);
  ok('mistouch guard', ((await toastTxt()) || '').includes('too quick'));
  await hold('#reply-hold', 2200);
  ok('sent — back under the sky', (await active()) === 'scr-sky');
  ok('it travels, no receipts', ((await toastTxt()) || '').includes('travels to tunde'));
  await sleep(500);
  ok('the comet crosses the sky', await exists('#comet'));
  await sleep(1600);
  ok('and lands on their light', (await page.$eval('.light[data-id="tunde"]', e => e.classList.contains('flared'))));

  console.log('— release —');
  await page.click('#release-btn');
  ok('release screen', (await active()) === 'scr-release');
  await hold('#rel-hold', 380);
  ok('too quick — hold a moment worth keeping', ((await toastTxt()) || '').includes('too quick'));
  await hold('#rel-hold', 2600);
  ok('the light forms in your hand', (await page.$eval('#release-orb', e => e.classList.contains('formed'))) &&
    (await page.$eval('#letgo-btn', e => e.classList.contains('show'))));
  await page.click('#letgo-btn');
  ok('launch animation fires', (await page.$eval('#release-orb', e => e.classList.contains('launch'))) &&
    (await page.$eval('#launch-trail', e => e.classList.contains('go'))));
  await sleep(1100);
  ok('back in the sky, released', (await active()) === 'scr-sky' && ((await toastTxt()) || '').includes('released'));
  ok('your light burns bright', (await page.$eval('.light.you', e => e.classList.contains('bright'))));

  console.log('— the ground (kit) —');
  await page.click('.light.you');
  ok('the ground opens', (await active()) === 'scr-ground');
  const stats = await page.$$eval('#g-stats .stat b', es => es.map(e => e.textContent));
  ok('stats count this session (13 released · 10 flares · 5 replies)', stats[0] === '13' && stats[1] === '10' && stats[2] === '5', 'got ' + stats.join('/'));
  ok('settled lights stratify', (await count('#g-list .bandhead')) === 2 && (await count('#g-list .row')) === 4);
  ok('the ground is yours alone', ((await txt('.nofollow')) || '').includes('no one sees your archive'));
  await page.click('#ground-back');
  ok('back to the sky', (await active()) === 'scr-sky');

  console.log('— settings (kit) —');
  await page.click('#gear-btn');
  ok('settings opens', (await active()) === 'scr-settings');
  await page.click('#horizon-trow');
  ok('horizon toggles off', !(await page.$eval('#horizon-sw', e => e.classList.contains('on'))));
  await page.click('#set-back');
  await page.click('#scope-btn'); /* city */
  await sleep(800);
  ok('no horizon — no strangers, even zoomed out', (await page.$$eval('.far-light', es => es.every(e => getComputedStyle(e).opacity === '0'))));
  await page.click('#scope-btn'); await page.click('#scope-btn'); await sleep(700);
  await page.click('#gear-btn');
  await page.click('#horizon-trow');
  ok('horizon back on', (await page.$eval('#horizon-sw', e => e.classList.contains('on'))));
  await page.click('#arrivals-trow');
  ok('arrival notices toggle', !(await page.$eval('#arrivals-sw', e => e.classList.contains('on'))) &&
    (await page.$eval('#incoming', e => getComputedStyle(e).opacity === '0')));
  await page.click('#arrivals-trow');
  await page.click('#about-row');
  ok('about dialog', ((await txt('#dialog .dtitle')) || '') === 'About' &&
    ((await page.$$eval('#dialog .pick .ph', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('how far · the sky'));
  await page.click('#dialog .dlg-close');
  await page.click('#set-back');
  ok('back to the sky', (await active()) === 'scr-sky');

  console.log('— integrity —');
  ok('no page errors across the whole run', errors.length === 0, errors.join(' ; '));

  await browser.close();
  console.log('\n==============================');
  console.log(fail === 0 ? `ALL ${pass} CHECKS PASSED ✓` : `${fail} FAILED / ${pass} passed`);
  if (failures.length) failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('SUITE CRASHED:', e); process.exit(2); });
