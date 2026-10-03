const puppeteer = require('puppeteer');
const FILE = 'file:///home/user/howfar/howfar-app-v8.html';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await b.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const vp of [{ width: 480, height: 900 }, { width: 360, height: 740 }]) {
    await page.setViewport(vp);
    await page.goto(FILE, { waitUntil: 'load' });
    await sleep(2600);
    const r = await page.evaluate(() => {
      const gs = (el, prop) => el ? getComputedStyle(el)[prop] : null;
      const out = {};
      out.bodyFont = gs(document.body, 'fontFamily');
      out.frameBg = gs(document.querySelector('.screen.active'), 'backgroundColor');
      const btn = document.querySelector('.btn-primary');
      out.primaryBg = gs(btn, 'backgroundColor'); out.primaryRadius = gs(btn, 'borderRadius');
      out.rowTitle = gs(document.querySelector('#circle-list .row .t'), 'fontSize');
      out.rowSub = gs(document.querySelector('#circle-list .row .s'), 'fontSize');
      out.rowSubColor = gs(document.querySelector('#circle-list .row .s'), 'color');
      out.statusColor = gs(document.querySelector('#me-status'), 'color');
      out.h1Size = gs(document.querySelector('.h1'), 'fontSize');
      // open a person and audit bubbles
      document.querySelectorAll('#circle-list .row')[0].click();
      const inb = document.querySelector('#msg-list .bubble.in');
      const outb = document.querySelector('#msg-list .bubble.out');
      out.bubbleIn = gs(inb, 'backgroundColor'); out.bubbleOut = gs(outb, 'backgroundColor');
      out.bubbleRadius = gs(inb, 'borderRadius');
      out.outMarginLeft = gs(outb, 'marginLeft');
      out.bandheadColor = gs(document.querySelector('.bandhead'), 'color');
      out.bandheadSize = gs(document.querySelector('.bandhead'), 'fontSize');
      out.overflowX = document.documentElement.scrollWidth > window.innerWidth ? 'OVERFLOWS' : 'fits';
      const banned = ['rgb(255, 74, 28)', 'rgb(198, 255, 61)'];
      const offenders = [];
      document.querySelectorAll('#screens *').forEach(el => {
        if (el.closest('svg') || el.tagName === 'svg') return;
        const c = getComputedStyle(el);
        [c.color, c.backgroundColor, c.borderColor].forEach(v => {
          if (banned.includes(v)) offenders.push(el.tagName + '.' + el.className + ' → ' + v);
        });
      });
      out.bannedColors = offenders.length ? offenders.slice(0, 5) : 'none — UI is 100% ReplyMate palette';
      return out;
    });
    console.log('=== viewport ' + vp.width + '×' + vp.height + ' ===');
    Object.entries(r).forEach(([k, v]) => console.log('  ' + k + ': ' + (Array.isArray(v) ? v.join(' ; ') : v)));
  }
  console.log(errors.length ? 'PAGE ERRORS: ' + errors.join('; ') : 'no page errors ✓');
  await b.close();
})().catch(e => { console.error('CRASH', e); process.exit(1); });
