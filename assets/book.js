/* Menyuntikkan kerangka aplikasi (sidebar + topbar) ke tiap mockup layar,
   supaya markup tiap bab hanya berisi isi layarnya. Sumber daftar menu:
   frontend/src/layouts/full/vertical/sidebar/Sidebaritems.ts */

const MENU = [
  { key: 'pt', name: 'Master PT', d: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1' },
  { key: 'mp', name: 'COA Marketplace', d: 'M3 9l1-5h16l1 5M3 9h18M3 9v11h18V9M8 13h8' },
  { key: 'src', name: 'Master Sumber Data', d: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3' },
  { key: 'label', name: 'Pemilahan Label', d: 'M3 5h18l-7 8v6l-4 2v-8z' },
  { key: 'type', name: 'Master Type COA', d: 'M3 12l9-9 9 9-9 9zM12 7v10' },
  { key: 'acc', name: 'COA Accounts', d: 'M4 5h7v15H4zM13 5h7v15h-7M7 9h1M16 9h1' },
  { key: 'assign', name: 'Assign COA', d: 'M5 12l4 4L19 6M4 19h16' },
  { key: 'view', name: 'View Data COA', d: 'M3 6h18M3 12h18M3 18h18M8 6v12' },
  { key: 'tpl', name: 'Master Template Export', d: 'M4 4h16v16H4zM10 4v16M15 4v16M4 9h16' },
  { key: 'export', name: 'Export Data COA', d: 'M12 3v12m0-12l-4 4m4-4l4 4M4 17v3h16v-3' },
  { key: 'fr', name: 'Report Finance', d: 'M6 20V10m6 10V4m6 16v-7' },
];

function icon(d) {
  return (
    '<svg class="gk-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'
  );
}

function sidebar(active, flagged, hidden) {
  const items = MENU.filter((m) => !hidden.includes(m.key)).map((m) => {
    const on = m.key === active ? ' is-on' : '';
    const nw = flagged.includes(m.key) && m.key !== active ? ' is-new' : '';
    const pill = flagged.includes(m.key) ? '<em class="gk-pill">BARU</em>' : '';
    return '<a class="' + (on + nw).trim() + '">' + icon(m.d) + m.name + pill + '</a>';
  }).join('');

  return (
    '<aside class="gk-side">' +
    '<div class="gk-logo"><div class="gk-logo__mark">GK</div><div class="gk-logo__txt">GK Komunika</div></div>' +
    '<div class="gk-side__cap">Finance &amp; Akunting</div>' +
    '<nav class="gk-nav">' + items + '</nav>' +
    '</aside>'
  );
}

function topbar() {
  return (
    '<header class="gk-top">' +
    '<div class="gk-top__search">' +
    '<svg class="gk-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
    '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>Cari…</div>' +
    '<div class="gk-top__spacer"></div>' +
    '<div class="gk-avatar">MA</div>' +
    '</header>'
  );
}

document.querySelectorAll('.gk-app').forEach((app) => {
  const active = app.dataset.active || '';
  const flagged = (app.dataset.flag || '').split(',').filter(Boolean);
  const hidden = (app.dataset.hide || '').split(',').filter(Boolean);
  const content = app.innerHTML;
  app.innerHTML =
    sidebar(active, flagged, hidden) +
    '<div class="gk-main">' + topbar() + '<div class="gk-body">' + content + '</div></div>';
});

/* Daftar isi mengikuti bab yang sedang dibaca. */
const links = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
const targets = links
  .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
  .filter(Boolean);

if ('IntersectionObserver' in window && targets.length) {
  const seen = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
      const first = targets.find((t) => seen.has(t.id));
      links.forEach((a) =>
        a.classList.toggle('is-active', !!first && a.getAttribute('href') === '#' + first.id),
      );
    },
    { rootMargin: '-10% 0px -70% 0px' },
  );
  targets.forEach((t) => io.observe(t));
}
