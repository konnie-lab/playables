// Run with Playwright MCP browser_run_code_unsafe, filename set to this file.
async (page) => {
  const errors = [];
  const failures = [];
  const check = (condition, description) => { if (!condition) throw new Error(description); };
  const onError = error => errors.push(error.message);
  const onResponse = response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4178')) failures.push(response.url()); };
  page.on('pageerror', onError);
  page.on('response', onResponse);
  const ready = () => page.waitForFunction(() => document.getElementById('loadingScreen').hidden && !document.getElementById('soundBtn').disabled);
  const layouts = [];
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://127.0.0.1:4178/playables/');
    await ready();
    check(await page.locator('#projectName').textContent() === 'CASTLE DUELS', 'Castle default project');
    await page.locator('#soundBtn').click();
    check(await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.audio.muted), 'Castle mute');
    await page.evaluate(() => { window.previousPortfolioApp = document.getElementById('gameFrame').contentWindow.app; });
    await page.locator('[data-project-step="1"]').click();
    await ready();
    check(await page.evaluate(() => previousPortfolioApp.destroyed && previousPortfolioApp.audio.active.size === 0 && previousPortfolioApp.loop.subscriberCount === 0), 'Previous app and voices destroyed');
    await page.evaluate(() => delete window.previousPortfolioApp);
    check(await page.locator('#projectName').textContent() === 'COURTSIDE', 'Basketball selected');
    check(await page.locator('#projectCount').textContent() === '02 / 02', 'Panel counter follows selection');
    check(await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.audio.muted), 'Mute survives project change');
    check(await page.locator('.project-section').count() === 2, 'Both project sections remain on the page');
    check((await page.locator('.standalone-link').nth(0).getAttribute('href')).startsWith('castle-duels/'), 'Castle standalone link');
    check((await page.locator('.standalone-link').nth(1).getAttribute('href')).startsWith('basketball/'), 'Courtside standalone link');
    await page.locator('[data-try-project="0"]').click();
    await ready();
    check(await page.locator('#projectName').textContent() === 'CASTLE DUELS', 'Castle project CTA selects Castle');
    await page.locator('[data-try-project="1"]').click();
    await ready();
    check(await page.locator('#projectName').textContent() === 'COURTSIDE', 'Courtside project CTA selects Courtside');
    await page.locator('#restartBtn').click();
    await ready();
    check(await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.audio.muted), 'Mute survives restart');
    for (const [width, height] of [[1440, 900], [390, 844], [320, 568], [720, 1200], [844, 390], [768, 1024]]) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(120);
      const layout = await page.evaluate(() => {
        const workshop = document.getElementById('workshop').getBoundingClientRect();
        const controls = document.querySelector('.player-controls').getBoundingClientRect();
        const footer = document.querySelector('.room-footer').getBoundingClientRect();
        const navigation = document.querySelector('.room-label').getBoundingClientRect();
        const frame = document.getElementById('gameFrame').getBoundingClientRect();
        const arrows = [...document.querySelectorAll('.project-switcher button')].map(button => button.getBoundingClientRect());
        return { overflow: document.documentElement.scrollWidth > innerWidth, header: document.querySelector('.intro').getBoundingClientRect().bottom + scrollY,
          controlsFit: controls.bottom < footer.top, navigationFits: navigation.right < workshop.right && navigation.left >= workshop.left,
          arrowsFit: arrows.every(arrow => arrow.left >= workshop.left && arrow.right <= workshop.right && arrow.width >= 44 && arrow.height >= 44),
          arrowsClearGame: arrows.every(arrow => arrow.right <= frame.left || arrow.left >= frame.right || arrow.bottom <= frame.top || arrow.top >= frame.bottom) };
      });
      check(!layout.overflow && layout.controlsFit && layout.navigationFits && layout.arrowsFit && layout.arrowsClearGame, `Layout ${width}x${height}: ${JSON.stringify(layout)}`);
      check(layout.header < 245, `Compact header ${width}x${height}`);
      layouts.push({ width, height, ...layout });
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await page.locator('#expandBtn').click();
    const expanded = await page.locator('.phone-shell').boundingBox();
    check(expanded.width > expanded.height && expanded.y >= 0 && expanded.y + expanded.height < 390, 'Expanded landscape game fits');
    await page.keyboard.press('Escape');
    check(!await page.evaluate(() => document.body.classList.contains('player-expanded')), 'Escape closes player');
    await page.locator('#previousProject').click();
    await ready();
    check(await page.locator('#projectCount').textContent() === '01 / 02', 'Outer arrows update panel counter');
    check(await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.main.soundButton.muted), 'Castle sound restored');
    for (let i = 0; i < 5; i++) await page.locator('#nextProject').click();
    await ready();
    check(await page.locator('#projectName').textContent() === 'COURTSIDE', 'Rapid switching settles on correct project');
    await page.locator('#motionBtn').click();
    check(await page.evaluate(() => document.body.classList.contains('ambience-paused')), 'Ambience pause');
    await page.locator('#motionBtn').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => document.getElementById('motionBtn').disabled);
    check(await page.locator('#motionBtn').isDisabled(), 'Reduced motion honored');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => !document.getElementById('motionBtn').disabled);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    check(await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.loop.paused), 'Offscreen playable pauses');
    await page.locator('#gameFrame').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    check(!await page.evaluate(() => document.getElementById('gameFrame').contentWindow.app.loop.paused), 'Visible playable resumes');
    check(errors.length === 0, `Page errors: ${errors.join('; ')}`);
    check(failures.length === 0, `Local resource errors: ${failures.join('; ')}`);
    return { passed: true, layouts, expanded, errors, failures };
  } finally {
    page.off('pageerror', onError);
    page.off('response', onResponse);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
}
