'use strict';
const primaryMenu = document.getElementById('primary-menu');
const mainTabs = [...primaryMenu.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('.tab-panel')];
const categoryMenu = document.querySelector('.paper-index');
const categoryTabs = [...categoryMenu.querySelectorAll('[role="tab"]')];
const categories = [...document.querySelectorAll('.pub-section')];
function choose(id,tabs,views){
  for(const view of views)view.hidden=view.id!==id;
  for(const tab of tabs){const active=tab.getAttribute('aria-controls')===id;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
}
function targetFrom(hash){try{return document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return null;}}
function reveal(target,scroll=false){
  if(!target){choose('publications',mainTabs,panels);return;}
  const panel=target.closest('.tab-panel');
  const category=target.closest('.pub-section');
  if(panel)choose(panel.id,mainTabs,panels);
  if(category)choose(category.id,categoryTabs,categories);
  if(scroll){
    const destination=categories.includes(target)?document.querySelector('.writing-heading'):target;
    destination.scrollIntoView({behavior:'auto',block:'start'});
  }
}
choose('publications',mainTabs,panels);
choose('published',categoryTabs,categories);
reveal(targetFrom(location.hash));
if(location.hash)requestAnimationFrame(()=>reveal(targetFrom(location.hash),true));
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const target=targetFrom(link.getAttribute('href'));if(!target)return;
  event.preventDefault();history.pushState(null,'',link.getAttribute('href'));reveal(target,true);
  if(link.getAttribute('role')!=='tab'){
    if(!target.hasAttribute('tabindex'))target.tabIndex=-1;
    target.focus({preventScroll:true});
  }
});
function keyboardTabs(menu,tabs,views){
  menu.addEventListener('keydown',event=>{
    const index=tabs.indexOf(event.target);if(index<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    const tab=tabs[next];choose(tab.getAttribute('aria-controls'),tabs,views);history.pushState(null,'',tab.getAttribute('href'));reveal(targetFrom(tab.getAttribute('href')),true);tab.focus({preventScroll:true});
  });
}
keyboardTabs(primaryMenu,mainTabs,panels);keyboardTabs(categoryMenu,categoryTabs,categories);
window.addEventListener('popstate',()=>reveal(targetFrom(location.hash),true));
window.addEventListener('hashchange',()=>reveal(targetFrom(location.hash),true));
const dialog=document.getElementById('figure-dialog');let trigger;
for(const link of document.querySelectorAll('.js-figure')){
  link.addEventListener('click',event=>{
    if(!dialog.showModal||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();trigger=link;
    document.getElementById('figure-dialog-title').textContent=link.dataset.title;
    document.getElementById('figure-dialog-image').src=link.href;
    document.getElementById('figure-dialog-image').alt=link.querySelector('img').alt;
    document.getElementById('figure-dialog-caption').textContent=link.dataset.caption;
    dialog.showModal();
  });
}
document.getElementById('close-figure').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>trigger?.focus());
