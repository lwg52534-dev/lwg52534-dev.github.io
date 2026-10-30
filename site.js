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
figureDialog.addEventListener('click', event => {if (event.target === figureDialog) {const r = figureDialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) figureDialog.close();}});
figureDialog.addEventListener('close', () => figureTrigger?.focus());
