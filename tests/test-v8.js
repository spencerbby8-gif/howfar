/* how far v8 — the check-in app · full browser test suite */
const puppeteer = require('puppeteer');
const FILE = 'file:///home/user/howfar/howfar-app-v8.html';

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, extra){
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (extra ? ' — ' + extra : '')); console.log('  ✗ FAIL: ' + name + (extra ? ' — ' + extra : '')); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function waitFor(page, fn, timeout, label){
  const t0 = Date.now();
  while (Date.now() - t0 < timeout){
    if (await fn()) return true;
    await sleep(600);
  }
  return false;
}

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
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
  async function hold(sel, ms){
    await page.hover(sel);
    await page.mouse.down();
    await sleep(ms);
    await page.mouse.up();
  }
  async function rowSub(name){
    return page.evaluate((n) => {
      const rows = document.querySelectorAll('#circle-list .row');
      for (const r of rows) if (r.querySelector('.t').textContent === n) return r.querySelector('.s').textContent;
      return null;
    }, name);
  }
  async function openPerson(name){
    await page.evaluate((n) => {
      const rows = document.querySelectorAll('#circle-list .row');
      for (const r of rows) if (r.querySelector('.t').textContent === n){ r.click(); break; }
    }, name);
  }

  await page.goto(FILE, { waitUntil: 'load' });
  console.log('— boot —');
  ok('splash is the first screen', (await active()) === 'scr-splash');
  await sleep(2600);
  ok('splash enters the circle', (await active()) === 'scr-circle');
  ok('around status line', ((await txt('#me-status')) || '').includes("you're around"));
  ok('around count line', ((await txt('#around-line')) || '').includes('3 of 6'));
  ok('privacy stance on home', ((await txt('#scr-circle .privacyline')) || '').includes('no read receipts'));
  ok('6 people in the circle', (await count('#circle-list .row')) === 6);
  ok('no search field, no text input anywhere (no typing, only voice)', !(await exists('#scr-circle input')) && !(await exists('#scr-person input')));
  ok("amara: waiting on you", ((await rowSub('amara')) || '').includes('waiting on you · 12m'));
  ok("tunde: your how far is waiting", ((await rowSub('tunde')) || '').includes('your how far is waiting · 3h'));
  ok("spencer: never", ((await rowSub('spencer')) || '').includes('never — say how far'));

  console.log('— a person = history in strata —');
  await openPerson('amara');
  ok('amara opens', (await active()) === 'scr-person' && (await txt('#person-name')) === 'amara');
  ok('how far back header', ((await txt('#person-rel')) || '').includes('how far back: 2 years'));
  ok('3 free band headers', (await count('#msg-list .bandhead')) === 3);
  ok('9 check-ins above the dig line', (await count('#msg-list .bubble')) === 9);
  ok('in/out bubble anatomy (5 hers / 4 yours)', (await count('#msg-list .bubble.in')) === 5 && (await count('#msg-list .bubble.out')) === 4);
  ok('dig boundary present', await exists('#digbtn'));
  ok('composer available (nothing of yours is waiting)', await exists('#person-send'));
  ok('her pending ping renders as how far?', ((await txt('#msg-list .bubble .ptext')) || '') === 'how far?');

  console.log('— dig —');
  await hold('#digbtn', 1500); await hold('#digbtn', 1500);
  ok('two digs -> earlier + last year (5 heads, 13 bubbles)', (await count('#msg-list .bandhead')) === 5 && (await count('#msg-list .bubble')) === 13);
  ok('echo chips on dug history', ((await page.$$eval('#msg-list .chip', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('◈ echo'));
  await hold('#digbtn', 1500); await hold('#digbtn', 1500);
  ok('bedrock statement', ((await txt('.bedrock .stmt')) || '').includes('Two years back.'));
  ok('anniversary line', ((await txt('.bedrock .anniv')) || '').includes('talked you through the night'));
  ok('bedrock is the floor — no dig button', !(await exists('#digbtn')));
  ok('14 check-ins after the full dig', (await count('#msg-list .bubble')) === 14);
  ok('bedrock bubbles dim', (await count('#msg-list .bubble.bedrocked')) === 1);
  await page.click('#person-back');
  ok('back to the circle', (await active()) === 'scr-circle');

  console.log('— one how-far at a time (the waiting gate) —');
  await openPerson('tunde');
  ok('tunde: 6 free check-ins + dig', (await count('#msg-list .bubble')) === 6 && await exists('#digbtn'));
  ok('your waiting voice shows it waits', ((await txt('#msg-list .bubble .chip')) || '').includes('it waits'));
  ok('composer is gated while it waits', !(await exists('#person-send')));
  ok('honest gate line', ((await txt('#composer-zone .notstanding')) || '').includes('still waiting'));
  ok('skip-the-wait affordance', await exists('#composer-zone .skiplink'));
  await hold('#digbtn', 1500);
  ok('dig once -> his oldest (7 bubbles, floor note)', (await count('#msg-list .bubble')) === 7 && ((await txt('#msg-list .floor')) || '').includes('nothing deeper between you'));
  await page.click('#composer-zone .skiplink');
  ok('he answers — the push', ((await toastTxt()) || '').includes('tunde answered your how far'));
  ok('his answer links to yours', ((await txt('#msg-list .bubble.in .chip')) || '').includes('an answer'));
  ok('your voice is marked answered', ((await page.$$eval('#msg-list .bubble.out .chip', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('answered'));
  ok('composer returns after the answer', await exists('#person-send'));
  await page.click('#person-back');

  console.log('— tap = bare ping —');
  await openPerson('kelechi');
  ok('kelechi: 5 check-ins, caught up, composer ready', (await count('#msg-list .bubble')) === 5 && await exists('#person-send'));
  await page.click('#person-send');
  ok('a tap pings instantly — no record screen', (await active()) === 'scr-person' && (await count('#msg-list .bubble')) === 6);
  ok('the ping is bare — how far?', ((await txt('#msg-list .bubble .ptext')) || '') === 'how far?');
  ok('it waits', ((await txt('#msg-list .bubble .chip')) || '').includes('it waits'));
  ok('ping toast', ((await toastTxt()) || '').includes('ping sent'));
  ok('gate engages after the ping', !(await exists('#person-send')));
  const kelechiAnswered = await waitFor(page, () =>
    page.evaluate(() => document.querySelector('#msg-list .bubble.in .chip') && document.querySelector('#msg-list .bubble.in .chip').textContent === 'an answer' && document.querySelectorAll('#msg-list .bubble').length === 7), 22000, 'kelechi answer');
  ok('the circle answers back (sim, ~9s)', kelechiAnswered);
  ok('your ping got answered', ((await page.$$eval('#msg-list .bubble.out .chip', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('answered'));
  await page.click('#person-back');
  ok('home shows caught up after the exchange', ((await rowSub('kelechi')) || '').includes('caught up'));

  console.log('— hold = voice, release = sent —');
  await openPerson('spencer');
  ok("empty history: say how far", ((await txt('#msg-list .firststate')) || '').includes('Nothing between you yet. Say how far.'));
  ok('composer available for a first check-in', await exists('#person-send'));
  await hold('#person-send', 1400);
  ok('hold opens the record screen', (await active()) === 'scr-checkin' && ((await txt('#checkin-status')) || '').includes('speaking to spencer'));
  ok('no parent note on a fresh check-in', await page.evaluate(() => getComputedStyle(document.getElementById('checkin-parent')).display === 'none'));
  await hold('#checkin-zone', 350);
  ok('mistouch guard (<1s sends nothing)', ((await toastTxt()) || '').includes('too quick — nothing sent') && (await active()) === 'scr-checkin');
  await hold('#checkin-zone', 2600);
  ok('pill confirms the send', ((await txt('#checkin-pill-lbl')) || '').includes('✓ sent · it waits'));
  await sleep(1700);
  ok('back in the thread after sending', (await active()) === 'scr-person');
  ok('one check-in between you now', (await count('#msg-list .bubble')) === 1);
  ok('it waits chip', ((await txt('#msg-list .bubble .chip')) || '').includes('it waits'));
  const spencerAnswered = await waitFor(page, () =>
    page.evaluate(() => document.querySelectorAll('#msg-list .bubble').length === 2 && document.querySelector('#msg-list .bubble.in .chip')), 24000, 'spencer answer');
  ok('spencer answers back (sim)', spencerAnswered);
  await page.click('#person-back');
  ok('home: spencer caught up', ((await rowSub('spencer')) || '').includes('caught up'));

  console.log('— answers, not likes —');
  await openPerson('amara');
  const bubbles = await page.$$('#msg-list .bubble');
  await bubbles[0].click(); /* her pending ping */
  ok('item dialog', (await exists('#overlay.show')) && ((await txt('#dialog .dtitle')) || '').includes('a ping'));
  const picks = await page.$$eval('#dialog .pick', es => es.map(e => e.textContent));
  ok('dialog options', picks[0].includes('▶ Play') && picks[1].includes('↳ Answer') && picks[2].includes('Cancel'));
  await (await page.$$('#dialog .pick'))[1].click();
  ok('answer opens the record screen with parent', (await active()) === 'scr-checkin' && await page.evaluate(() => { const el = document.getElementById('checkin-parent'); return getComputedStyle(el).display !== 'none' && el.textContent.includes('an answer to amara'); }));
  await hold('#checkin-zone', 2200);
  await sleep(1700);
  ok('answer sinks into the thread', (await active()) === 'scr-person');
  ok('your answer carries the chip', ((await txt('#msg-list .bubble.out .chip')) || '').includes('an answer'));
  ok('her ping is marked answered (green)', await page.evaluate(() => { const c = document.querySelector('#msg-list .bubble.in .chip'); return !!c && c.textContent === '✓ answered' && c.classList.contains('done'); }));
  ok('the push fires once — to her', ((await toastTxt()) || '').includes('push sent to amara'));
  await page.click('#person-back');

  console.log('— the drift (chidi) —');
  await openPerson('chidi');
  ok('nothing recent — the last time named', ((await txt('#msg-list .firststate')) || '').includes('Nothing recent. The last time was eight months ago.'));
  ok('dig offered anyway', await exists('#digbtn'));
  await hold('#digbtn', 1500); await hold('#digbtn', 1500); await hold('#digbtn', 1500); await hold('#digbtn', 1500);
  ok('full dig: last year, way back (2 heads)', (await count('#msg-list .bandhead')) === 2);
  ok('7 check-ins in the deep', (await count('#msg-list .bubble')) === 7);
  ok('bedrock tells the truth about drifting', ((await txt('.bedrock .stmt')) || '').includes('drifted') && ((await txt('.bedrock .anniv')) || '').includes('all falling apart'));
  await page.click('#person-send'); /* tap: a ping to chidi */
  ok('you can still say how far to someone you drifted from', (await count('#msg-list .bubble')) === 8 && ((await txt('#msg-list .bubble .chip')) || '').includes('it waits'));
  await page.click('#composer-zone .skiplink');
  ok('some people answer when they answer', ((await toastTxt()) || '').includes('chidi answers when he answers'));
  ok('still waiting — the gate holds', !(await exists('#person-send')));
  await page.click('#person-back');

  console.log('— around: a count, never a location —');
  await page.click('#around-line');
  ok('around screen opens', (await active()) === 'scr-around');
  ok('the count is a number', /^\d$/.test((await txt('#around-n')) || ''));
  ok('of your 6', ((await txt('#around-sub')) || '').includes('of your 6'));
  ok('ticker has life', (await count('#around-ticker .tick')) >= 5);
  ok('privacy chip verbatim', ((await txt('.livenum .priv')) || '').includes('a count, never a location'));
  await page.click('#around-back');
  ok('back to the circle', (await active()) === 'scr-circle');

  console.log('— person info —');
  await openPerson('amara');
  await page.click('#person-info');
  ok('info dialog', ((await txt('#dialog .dtitle')) || '') === 'amara' && (await count('#dialog .pick')) === 4);
  await page.click('#dialog .dlg-close');
  ok('dialog closes', !(await exists('#overlay.show')));
  await page.click('#person-back');

  console.log('— settings —');
  await page.click('#gear-btn');
  ok('settings opens', (await active()) === 'scr-settings');
  await page.click('#ghost-trow');
  ok('ghost toggles on', (await page.$eval('#ghost-sw', e => e.classList.contains('on'))));
  await page.click('#ghost-trow');
  ok('ghost toggles off', !(await page.$eval('#ghost-sw', e => e.classList.contains('on'))));
  await page.click('#push-trow');
  ok('push toggles', !(await page.$eval('#push-sw', e => e.classList.contains('on'))));
  await page.click('#push-trow');
  await page.click('#anniv-trow');
  ok('anniversaries toggle', !(await page.$eval('#anniv-sw', e => e.classList.contains('on'))));
  await page.click('#anniv-trow');
  await page.click('#keep-row');
  ok('keep-history picker with current marked', ((await txt('#dialog .pick.cur .ph')) || '').includes('✓ Forever'));
  const keepPicks = await page.$$('#dialog .pick');
  await keepPicks[1].click(); /* 2 years */
  ok('keep-history changes honestly', ((await txt('#keep-sub')) || '').includes('keep: 2 years'));
  await page.click('#deepest-row');
  ok('deepest history opens the deepest person', (await active()) === 'scr-person' && (await txt('#person-name')) === 'amara');
  await page.click('#person-back');
  ok('back lands on settings', (await active()) === 'scr-settings');

  console.log('— ghost: miss nothing, be missed quietly —');
  await page.click('#ghost-trow'); /* ghost on */
  await page.click('#set-back');
  ok('home reflects ghost (amber)', (await page.$eval('#me-status', e => e.classList.contains('warn') && e.textContent.includes('ghost'))));
  await openPerson('tunde');
  await page.click('#person-send'); /* ping while ghost */
  ok('ghost blocks nothing you send', (await count('#msg-list .bubble')) === 9);
  await page.click('#composer-zone .skiplink');
  ok('answers arrive quietly under ghost — no push', ((await toastTxt()) || '').includes('quietly'));
  ok('the answer still landed', ((await txt('#msg-list .bubble.in .chip')) || '').includes('an answer'));
  await page.click('#person-back');
  await page.click('#me-status');
  ok('one tap back to around', ((await txt('#me-status')) || '').includes("you're around"));

  console.log('— how far you have gone —');
  await page.click('#gear-btn');
  await page.click('#circle-row');
  ok('my circle opens', (await active()) === 'scr-mycircle');
  const stats = await page.$$eval('#mc-stats .stat b', es => es.map(e => e.textContent));
  ok('stats computed live (21 check-ins, 19 answered)', stats[0] === '21' && stats[1] === '19', 'got ' + stats.join('/'));
  ok('deepest = chidi (11 months of yours, at the bottom)', stats[2] === 'chidi');
  ok('6 people with history', (await count('#mc-list .row')) === 6);
  ok('no follower counts, ever', ((await txt('.nofollow')) || '').includes('no follower counts'));
  await (await page.$$('#mc-list .row'))[0].click();
  ok('rows open people', (await active()) === 'scr-person' && (await txt('#person-name')) === 'amara');
  await page.click('#person-back');
  ok('back lands on my circle', (await active()) === 'scr-mycircle');
  await page.click('#mc-back');
  ok('back lands on settings', (await active()) === 'scr-settings');
  await page.click('#set-back');
  ok('back lands on the circle', (await active()) === 'scr-circle');

  console.log('— integrity —');
  ok('no page errors across the whole run', errors.length === 0, errors.join(' ; '));

  await browser.close();
  console.log('\n==============================');
  console.log(fail === 0 ? `ALL ${pass} CHECKS PASSED ✓` : `${fail} FAILED / ${pass} passed`);
  if (failures.length) failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('SUITE CRASHED:', e); process.exit(2); });
