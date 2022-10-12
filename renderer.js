const { ipcRenderer } = require('electron');

const anchors = document.body.querySelectorAll('a');

for (const anchor of anchors) {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('load-url', e.target.href);
  })
}