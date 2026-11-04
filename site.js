'use strict';
document.documentElement.classList.add('js-ready');
const menuButton = document.querySelector('.menu-toggle');
const primaryMenu = document.getElementById('primary-menu');
const tabs = [...primaryMenu.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('.tab-panel')];
const categoryMenu = document.querySelector('.paper-index');
const categoryTabs = [...categoryMenu.querySelectorAll('[role="tab"]')];
const categories = [...document.querySelectorAll('.pub-section')];
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  primaryMenu.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  primaryMenu.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
function selectTab(id, tabList, panelList) {
  for (const panel of panelList) panel.hidden = panel.id !== id;
  for (const tab of tabList) {
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
  const category = target?.closest('.pub-section');
  if (panel) selectTab(panel.id, tabs, panels);
  else if (!target || target.id === 'about') {
    selectTab('publications', tabs, panels);
    selectTab('published', categoryTabs, categories);
  }
  if (category) selectTab(category.id, categoryTabs, categories);
  const scrollTarget = category && target === category ? document.getElementById('publications') : target;
  if (scroll && scrollTarget) scrollTarget.scrollIntoView({behavior:'auto',block:'start'});
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = resolveHash(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  const menuWasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  closeMenu();
  history.pushState(null, '', link.getAttribute('href'));
  revealTarget(target, true);
  if ((link.getAttribute('role') !== 'tab' || menuWasOpen) && target.id !== 'about') {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({preventScroll:true});
  }
});
function keyboardTabs(menu, list, panelList) {
  menu.addEventListener('keydown', event => {
    const i = list.indexOf(event.target);
    if (i < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
    const tab = list[next];
    history.pushState(null, '', tab.getAttribute('href'));
    selectTab(tab.getAttribute('aria-controls'), list, panelList);
    tab.focus();
  });
}
keyboardTabs(primaryMenu,tabs,panels);
keyboardTabs(categoryMenu,categoryTabs,categories);
window.addEventListener('popstate', () => revealTarget(resolveHash(location.hash), true));
window.addEventListener('hashchange', () => revealTarget(resolveHash(location.hash), true));
selectTab('published',categoryTabs,categories);
revealTarget(resolveHash(location.hash),false);
if (location.hash) requestAnimationFrame(() => revealTarget(resolveHash(location.hash),true));
const figureDialog = document.getElementById('figure-dialog');
let figureTrigger;
for (const link of document.querySelectorAll('.js-figure')) {
  link.addEventListener('click', event => {
    if (!figureDialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); figureTrigger = link;
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
    if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) figureDialog.close();
  }
});
figureDialog.addEventListener('close', () => figureTrigger?.focus());
