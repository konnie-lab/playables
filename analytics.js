// Count public portfolio page opens only, without sessions or browser storage.
(() => {
  const pages = {
    '/playables/': ['/playables/', 'Konnie Lab — Portfolio'],
    '/playables/index.html': ['/playables/', 'Konnie Lab — Portfolio'],
    '/playables/about.html': ['/playables/about.html', 'Konnie Lab — About me'],
  };
  const page = pages[location.pathname];
  if (location.origin !== 'https://konnie-lab.github.io'
    || !page || navigator.webdriver || window.top !== window.self) return;

  const source = document.referrer ? new URL(document.referrer).origin : '';
  const query = new URLSearchParams({ p: page[0], t: page[1], ns: 'true', r: source });
  fetch('https://konnie-lab.goatcounter.com/count?' + query, {
    mode: 'no-cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    cache: 'no-store',
    keepalive: true,
  }).catch(() => {});
})();
