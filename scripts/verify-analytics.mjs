import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../analytics.js', import.meta.url), 'utf8');
const run = async (url, overrides = {}) => {
  const requests = [];
  const window = {};
  window.top = window.self = window;
  const context = {
    location: new URL(url), navigator: { webdriver: false }, window,
    document: { referrer: 'https://example.org/private?secret=hidden' },
    URL, URLSearchParams,
    fetch: (url, options) => {
      requests.push({ url: new URL(url), options });
      return Promise.resolve();
    },
    ...overrides,
  };
  vm.runInNewContext(source, context);
  await Promise.resolve();
  return requests;
};

for (const [path, expected] of [
  ['/playables/', '/playables/'],
  ['/playables/index.html?private=hidden#contact', '/playables/'],
  ['/playables/about.html?private=hidden', '/playables/about.html'],
]) {
  const requests = await run('https://konnie-lab.github.io' + path);
  assert.equal(requests.length, 1);
  const { url, options } = requests[0];
  assert.equal(url.origin, 'https://konnie-lab.goatcounter.com');
  assert.equal(url.pathname, '/count');
  assert.equal(url.searchParams.get('p'), expected);
  assert.equal(url.searchParams.get('ns'), 'true');
  assert.equal(url.searchParams.get('r'), 'https://example.org');
  assert.deepEqual([...url.searchParams.keys()].sort(), ['ns', 'p', 'r', 't']);
  assert.equal(options.credentials, 'omit');
  assert.equal(options.referrerPolicy, 'no-referrer');
  assert.equal(options.keepalive, true);
}
for (const url of [
  'http://127.0.0.1:4178/playables/', 'file:///C:/JS/Konnie-Portfolio/index.html',
  'https://konnie-lab.github.io/save-your-job/',
  'https://konnie-lab.github.io/playables/castle-duels/index.html',
  'https://konnie-lab.github.io/playables/basketball/index.html',
  'https://konnie-lab.github.io/playables/old_playables/',
]) assert.equal((await run(url)).length, 0, url);
assert.equal((await run('https://konnie-lab.github.io/playables/', { navigator: { webdriver: true } })).length, 0);
assert.equal((await run('https://konnie-lab.github.io/playables/', { window: { top: {}, self: {} } })).length, 0);
assert.equal((await run('https://konnie-lab.github.io/playables/', { document: { referrer: '' } }))[0].url.searchParams.get('r'), '');
await run('https://konnie-lab.github.io/playables/', { fetch: () => Promise.reject(new Error('Blocked')) });
console.log('Portfolio analytics: paths, privacy, automation, iframe exclusion and blocked requests passed.');
