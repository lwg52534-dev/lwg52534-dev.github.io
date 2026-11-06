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
    const index=tabs.indexOf(event.target);if(index<0||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;
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
// Progressive enhancement: content remains visible if motion is unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }
  }, {threshold: 0.08});
  for (const element of document.querySelectorAll('.publication:not(.featured-paper), .project-spread, .patent, .honor')) {
    element.classList.add('reveal-ready'); observer.observe(element);
  }
}

const categoryOrientation = window.matchMedia('(max-width: 800px)');
function setCategoryOrientation(){categoryMenu.setAttribute('aria-orientation',categoryOrientation.matches?'horizontal':'vertical');}
setCategoryOrientation();categoryOrientation.addEventListener('change',setCategoryOrientation);

// A searchable local index. Results link back to the original record.
const searchDialog = document.getElementById('research-search');
const searchInput = document.getElementById('research-query');
const resultContainer = document.getElementById('search-results');
const searchCount = document.getElementById('search-count');
const searchEmpty = document.getElementById('search-empty');
const searchTriggers = [...document.querySelectorAll('.search-trigger')];
const normalize = text => text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const researchIndex = [...document.querySelectorAll('.publication')].map(article => ({
 id:article.id,
 title:article.querySelector('.paper-title').textContent.trim().replace(/\s+/g,' '),
 authors:(article.querySelector('.authors') || article.querySelector('p:not([class])'))?.textContent.trim().replace(/\s+/g,' ') || '',
 category:document.getElementById(article.closest('.pub-section').getAttribute('aria-labelledby')).querySelector('span').textContent,
 text:normalize(article.textContent)
}));
let searchTrigger, searchDestination = null;
function renderResearchSearch(){
 const words=normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean);
 const results=researchIndex.filter(item=>words.every(word=>item.text.includes(word)));
 resultContainer.replaceChildren();
 for(const item of results){
  const link=document.createElement('a');link.className='search-result';link.href='#'+item.id;
  for(const [className,value] of [['result-category',item.category],['result-title',item.title],['result-authors',item.authors]]){
   const span=document.createElement('span');span.className=className;span.textContent=value;link.append(span);
  }
  resultContainer.append(link);
 }
 searchCount.textContent=`${results.length} ${results.length===1?'record':'records'}${words.length?' found':' · papers & books'}`;
 searchEmpty.hidden=results.length>0;
}
function openResearchSearch(event){
 if(!searchDialog.showModal||searchDialog.open)return;
 searchTrigger=event?.currentTarget||document.activeElement;
 searchDestination=null;searchInput.value='';renderResearchSearch();searchDialog.showModal();searchInput.focus();
}
for(const button of searchTriggers){button.hidden=false;button.addEventListener('click',openResearchSearch);}
searchInput.addEventListener('input',renderResearchSearch);
document.getElementById('clear-search').addEventListener('click',()=>{searchInput.value='';renderResearchSearch();searchInput.focus();});
document.getElementById('close-search').addEventListener('click',()=>searchDialog.close());
resultContainer.addEventListener('click',event=>{
 const link=event.target.closest('.search-result');if(!link)return;
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();event.stopPropagation();
 searchDestination=document.getElementById(link.hash.slice(1));
 history.pushState(null,'',link.hash);searchDialog.close();
});
searchDialog.addEventListener('close',()=>{
 if(searchDestination){const destination=searchDestination;searchDestination=null;reveal(destination,true);destination.tabIndex=-1;destination.focus({preventScroll:true});}
 else searchTrigger?.focus({preventScroll:true});
});
searchDialog.addEventListener('keydown',event=>{
 const results=[...resultContainer.querySelectorAll('a')];
 if(!results.length)return;
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){
  event.preventDefault();let i=results.indexOf(document.activeElement);
  i=event.key==='ArrowDown'?(i+1)%results.length:(i<=0?results.length-1:i-1);results[i].focus();
 }else if(event.key==='Enter'&&event.target===searchInput){event.preventDefault();results[0].click();}
});
document.addEventListener('keydown',event=>{
 if(event.key!=='/'||event.metaKey||event.ctrlKey||event.altKey||document.querySelector('dialog[open]'))return;
 if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 event.preventDefault();openResearchSearch();
});
searchDialog.addEventListener('click',event=>{
 if(event.target!==searchDialog)return;
 const r=searchDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)searchDialog.close();
});

// Reading position and a small contact utility; neither requires a service.
const progressBar=document.querySelector('.reading-progress span');
let progressPending=false;
function updateReadingProgress(){const length=document.documentElement.scrollHeight-innerHeight;progressBar.style.transform=`scaleX(${length>0?Math.min(1,Math.max(0,scrollY/length)):0})`;progressPending=false;}
window.addEventListener('scroll',()=>{if(!progressPending){progressPending=true;requestAnimationFrame(updateReadingProgress);}},{passive:true});
window.addEventListener('resize',updateReadingProgress);
window.addEventListener('hashchange',updateReadingProgress);
new ResizeObserver(updateReadingProgress).observe(document.querySelector('main'));
updateReadingProgress();
const copyEmail=document.getElementById('copy-email');
if(navigator.clipboard?.writeText){copyEmail.hidden=false;copyEmail.addEventListener('click',async()=>{
 const feedback=document.getElementById('copy-feedback');
 try{await navigator.clipboard.writeText('lwg5253@kaist.ac.kr');feedback.textContent='Email address copied';}
 catch{feedback.textContent='Select the email address above to copy it.';}
});}
