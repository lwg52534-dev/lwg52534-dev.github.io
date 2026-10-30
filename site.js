document.documentElement.classList.add('js-ready');
const menuButton = document.querySelector('.menu-toggle');
const primaryMenu = document.getElementById('primary-menu');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  primaryMenu.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  primaryMenu.classList.toggle('is-open', open);
});
primaryMenu.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
const tabs = [...primaryMenu.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('.tab-panel')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function activatePanel(id) {
  for (const panel of panels) panel.hidden = panel.id !== id;
  for (const tab of tabs) {
    const active = tab.getAttribute('aria-controls') === id;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  }
}
function resolveHash(hash) {
  try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
  catch { return null; }
}
function revealTarget(target, scroll) {
  const panel = target?.closest('.tab-panel');
  if (panel) activatePanel(panel.id);
  else if (!target || target.id === 'about') activatePanel('publications');
  if (scroll && target) target.scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth', block:'start'});
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = resolveHash(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  closeMenu();
  history.pushState(null, '', link.getAttribute('href'));
  revealTarget(target, true);
});
primaryMenu.addEventListener('keydown', event => {
  const i = tabs.indexOf(event.target);
  if (i === -1 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  const tab = tabs[next];
  history.pushState(null, '', tab.getAttribute('href'));
  activatePanel(tab.getAttribute('aria-controls'));
  tab.focus();
});
window.addEventListener('popstate', () => revealTarget(resolveHash(location.hash), true));
window.addEventListener('hashchange', () => revealTarget(resolveHash(location.hash), true));
revealTarget(resolveHash(location.hash), false);
// A direct link may initially point into a panel that progressive enhancement hides.
if (location.hash) requestAnimationFrame(() => revealTarget(resolveHash(location.hash), true));

const figureDialog = document.getElementById('figure-dialog');
let figureTrigger;
for (const link of document.querySelectorAll('.js-figure')) {
  link.addEventListener('click', event => {
    if (!figureDialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    figureTrigger = link;
    document.getElementById('figure-dialog-title').textContent = link.dataset.title;
    document.getElementById('figure-dialog-image').src = link.href;
    document.getElementById('figure-dialog-image').alt = link.querySelector('img').alt;
    document.getElementById('figure-dialog-caption').textContent = link.dataset.caption;
    figureDialog.showModal();
  });
}
document.getElementById('close-figure').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  if (event.target === figureDialog) {
    const r = figureDialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) figureDialog.close();
  }
});
figureDialog.addEventListener('close', () => figureTrigger?.focus());
