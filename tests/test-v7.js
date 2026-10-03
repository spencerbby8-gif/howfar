/* how far v7 — full browser test suite */
const puppeteer = require('puppeteer');
const FILE = 'file:///home/user/howfar/howfar-app-v7.html';

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; failures.push(name + (extra ? ' — ' + extra : '')); console.log('  ✗ FAIL: ' + name + (extra ? ' — ' + extra : '')); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  async function hold(sel, ms) {
    await page.hover(sel);
    await page.mouse.down();
    await sleep(ms);
    await page.mouse.up();
  }
  async function holdHandle(h, ms) {
    await h.hover();
    await page.mouse.down();
    await sleep(ms);
    await page.mouse.up();
  }

  await page.goto(FILE, { waitUntil: 'load' });
  console.log('— boot —');
  ok('splash is the first screen', (await active()) === 'scr-splash');
  await sleep(2600);
  ok('splash auto-enters the ground', (await active()) === 'scr-ground');
  ok('standing status line', ((await txt('#ground-status')) || '').includes("standing in rumuokoro junction"));
  ok('5 near-you rows', (await count('#near-list .row')) === 5);
  ok('no search field anywhere (D3)', !(await exists('#scr-ground input')) && !(await exists('#scr-place input')));
  const rows = await page.$$('#near-list .row');
  const t0 = await rows[0].$eval('.t', e => e.textContent);
  ok("standing place marked 'you're here'", t0.includes("rumuokoro junction") && t0.includes("you're here"));
  const s4 = await rows[4].$eval('.s', e => e.textContent);
  ok("empty place invites 'you're the first'", s4.includes("you're the first"));

  console.log('— a place = strata —');
  await rows[0].click();
  ok('place opens', (await active()) === 'scr-place' && (await txt('#place-name')) === 'rumuokoro junction');
  ok('live count sub', ((await txt('#place-rel')) || '').includes('6 here right now'));
  ok('4 free band headers (surface..settling)', (await count('#msg-list .bandhead')) === 4);
  ok('6 voices above the dig line', (await count('#msg-list .bubble')) === 6);
  ok('dig boundary present', await exists('#digbtn'));
  ok('in/out bubble anatomy', (await count('#msg-list .bubble.in')) === 4 && (await count('#msg-list .bubble.out')) === 2);

  console.log('— dig —');
  await hold('#digbtn', 1500);
  ok('dig 1 -> sediment', (await count('#msg-list .bandhead')) === 5 && (await count('#msg-list .bubble')) === 7);
  ok('echo found chip', ((await page.$$eval('#msg-list .chip', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('◈ echo'));
  await hold('#digbtn', 1500);
  ok('dig 2 -> deep', (await count('#msg-list .bandhead')) === 6 && (await count('#msg-list .bubble')) === 8);
  await hold('#digbtn', 1500);
  ok('bedrock statement', ((await txt('.bedrock .stmt')) || '').includes('Two years down.'));
  ok('anniversary line', ((await txt('.bedrock .anniv')) || '').includes('one year ago'));
  ok('bedrock is the floor (no dig button)', !(await exists('#digbtn')));
  ok('9 voices total after full dig', (await count('#msg-list .bubble')) === 9);
  await page.click('#place-back');
  ok('back returns to ground', (await active()) === 'scr-ground');

  console.log('— shallow place + empty place —');
  let r2 = await page.$$('#near-list .row');
  await r2[2].click(); // creek market
  ok('shallow place: 3 voices, no dig', (await count('#msg-list .bubble')) === 3 && !(await exists('#digbtn')));
  ok('shallow floor note', ((await txt('#msg-list .floor')) || '').includes('nothing deeper'));
  await page.click('#place-back');
  r2 = await page.$$('#near-list .row');
  await r2[4].click(); // unnamed place
  ok("empty state: you're the first", ((await txt('#msg-list .firststate')) || '').includes("You're the first"));
  ok('not standing — honest line', ((await txt('.notstanding')) || '').includes("you're not standing here"));
  await page.click('.walklink');
  ok('walk simulation arms the composer', await exists('#place-drop'));

  console.log('— drop: hold, release = sunk —');
  await hold('#place-drop', 1400);
  ok('drop screen opens at the standing place', (await active()) === 'scr-drop' && ((await txt('#drop-status')) || '').includes('unnamed place'));
  await hold('#dropzone', 350);
  ok('mistouch guard (<1s drops nothing)', ((await toastTxt()) || '').includes('too quick') && (await active()) === 'scr-drop');
  await hold('#dropzone', 2600);
  await sleep(1700);
  ok('sunk -> back in the thread', (await active()) === 'scr-place');
  ok('new voice on top with sunk chip', ((await txt('#msg-list .bubble .chip')) || '').includes('✓ sunk · it waits for whoever stands next'));
  ok('the first place now has 1 voice', (await count('#msg-list .bubble')) === 1);
  await page.click('#place-back');
  ok('ground reflects the new moment', ((await page.$$eval('#near-list .row .s', es => es.map(e => e.textContent).join('|')).catch(() => '')) || '').includes('you · just now'));

  console.log('— answers, not likes —');
  let r3 = await page.$$('#near-list .row');
  await r3[0].click(); // junction (already dug to bedrock)
  ok('junction remembers the dig (bedrock visible)', ((await txt('.bedrock .stmt')) || '').includes('Two years down.'));
  /* we walked to unnamed earlier — answers require standing here (P2). walk. */
  await page.click('.walklink');
  ok('walked to junction — composer armed', await exists('#place-drop'));
  const bubbles = await page.$$('#msg-list .bubble');
  await bubbles[0].click();
  ok('voice dialog: play / answer / cancel', (await exists('#overlay.show')) && ((await txt('#dialog .dtitle')) || '').includes('a voice'));
  const picks = await page.$$eval('#dialog .pick', es => es.map(e => e.textContent));
  ok('dialog options', picks[0].includes('▶ Play') && picks[1].includes('↳ Answer') && picks[2].includes('Cancel'));
  await (await page.$$('#dialog .pick'))[1].click(); // Answer
  ok('answer opens the drop with parent', (await active()) === 'scr-drop' && (await page.$eval('#drop-parent', e => getComputedStyle(e).display !== 'none')));
  await hold('#dropzone', 2200);
  await sleep(1700);
  ok('answer sinks into the thread', (await active()) === 'scr-place');
  const chips = await page.$$eval('#msg-list .chip', es => es.map(e => e.textContent).join('|'));
  ok('linked answer chips', chips.includes('✓ sunk · an answer') && chips.includes('|an answer') || chips.startsWith('an answer'));
  ok('push fires once, for the answer', ((await toastTxt()) || '').includes('someone answered you at'));

  console.log('— live —');
  await page.click('#place-live');
  ok('live screen', (await active()) === 'scr-live' && (await txt('#live-name')) === 'rumuokoro junction');
  ok('the count, never a coordinate', ((await txt('#live-n')) !== null) && ((await txt('.livenum .priv')) || '').includes('a count, never a coordinate'));
  ok('ticker rows', (await count('#ticker .tick')) >= 5);
  await page.click('#live-back');
  ok('back from live', (await active()) === 'scr-place');
  await page.click('#place-info');
  ok('place info dialog', ((await txt('#dialog .dtitle')) || '') === 'rumuokoro junction');
  await page.click('#dialog .dlg-close');
  ok('dialog closes', !(await exists('#overlay.show')));
  await page.click('#place-back');

  console.log('— settings —');
  await page.click('#gear-btn');
  ok('settings opens', (await active()) === 'scr-settings');
  await page.click('#ghost-trow');
  ok('ghost mode toggle flips on', (await page.$eval('#ghost-sw', e => e.classList.contains('on'))));
  await page.click('#ghost-trow');
  ok('ghost mode toggle flips off', !(await page.$eval('#ghost-sw', e => e.classList.contains('on'))));
  await page.click('#precision-row');
  ok('precision picker with current marked', ((await txt('#dialog .pick.cur .ph')) || '').includes('✓ Exact'));
  const pPicks = await page.$$('#dialog .pick');
  await pPicks[0].click(); // Block
  ok('precision changes honestly', ((await txt('#precision-sub')) || '').includes('active: block') && ((await txt('#precision-sub')) || '').includes('browse only'));

  console.log('— my ground —');
  await page.click('#myplaces-row');
  ok('my ground opens', (await active()) === 'scr-myground');
  const stats = await page.$$eval('#mg-stats .stat b', es => es.map(e => e.textContent));
  ok('stats computed from the data (4 places, 7 moments)', stats[0] === '4' && stats[1] === '7');
  ok('deepest = settling (gate, 5 months)', stats[2] === 'settling');
  ok('4 place rows', (await count('#mg-list .row')) === 4);
  ok('no follower counts, ever', ((await txt('.nofollow')) || '').includes('no follower counts'));
  await (await page.$$('#mg-list .row'))[0].click();
  ok('my ground rows open places', (await active()) === 'scr-place');
  await page.click('#place-back');
  ok('back from place lands on my ground', (await active()) === 'scr-myground');
  await page.click('#mg-back');
  ok('back from my ground lands on settings', (await active()) === 'scr-settings');
  await page.click('#set-back');

  console.log('— presence gate + location honesty —');
  ok('back on ground, standing shows junction (walked there)', ((await txt('#ground-status')) || '').includes('rumuokoro junction'));
  await page.click('#ground-status');
  ok('location off -> amber honest line', ((await txt('#ground-status')) || '').includes('Location is off'));
  await hold('#ground-drop', 1300);
  ok('cannot drop with location off', (await active()) === 'scr-ground' && ((await toastTxt()) || '').includes('Location is off'));
  await page.click('#ground-status');
  ok('location back on', ((await txt('#ground-status')) || '').includes('standing in'));
  await hold('#ground-drop', 1400);
  ok('ground bar opens drop at standing place', (await active()) === 'scr-drop');
  await hold('#dropzone', 2000);
  await sleep(1700);
  ok('second drop sinks, returns to ground', (await active()) === 'scr-ground');

  console.log('— integrity —');
  ok('no page errors across the whole run', errors.length === 0, errors.join(' ; '));

  await browser.close();
  console.log('\n==============================');
  console.log(fail === 0 ? `ALL ${pass} CHECKS PASSED ✓` : `${fail} FAILED / ${pass} passed`);
  if (failures.length) failures.forEach(f => console.log('  ✗ ' + f));
  process.exit(fail === 0 ? 0 : 1);
})().catch(e => { console.error('SUITE CRASHED:', e); process.exit(2); });
