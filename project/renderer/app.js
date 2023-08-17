// Modules
const { ipcRenderer, shell } = require('electron');
const items = require('../storage/items');

// Dom nodes
const showModal = document.getElementById('show-modal'),
      closeModal = document.getElementById('close-modal'),
      modal = document.getElementById('modal'),
      addItem = document.getElementById('add-item'),
      itemUrl = document.getElementById('url'),
      search = document.getElementById('search');

// Disable & Enable modal buttons
const toggleModalButtons = () => {
  if (addItem.disabled) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
}

// Listening search changed
search.addEventListener('keyup', () => {
  Array.from(document.getElementsByClassName('read-item')).forEach(item => {
    const hasMatch = item.innerText.toLowerCase().includes(search.value.trim().toLowerCase());
    item.style.display = hasMatch ? 'flex' : 'none';
  })

});

// Show modal
showModal.addEventListener('click', e => {
  modal.style.display = 'flex';
  itemUrl.focus();
});

// Hide modal
closeModal.addEventListener('click', e => {
  modal.style.display = 'none';
});

// Handle new item
addItem.addEventListener('click', e => {
  
  // Check a url exists
  if (itemUrl.value) {
    console.log(itemUrl.value);
    // Send new item url to main process
    ipcRenderer.send('new-item', {
      url: itemUrl.value
    });
    toggleModalButtons();    
  }
});

// Listen for keyboard submit
itemUrl.addEventListener('keyup', e => {
  if(e.key === 'Enter') {
    addItem.click();
  }
});

// Listen for new-item event
ipcRenderer.on('new-item-success', (e, {url, screenshot, title}) => {
  console.log('item in renderer', {url, screenshot, title});
  items.addItem({url, screenshot, title});
  toggleModalButtons();
  closeModal.click();
});

ipcRenderer.on('menu-show-modal', (e) => {
  showModal.click();
});

ipcRenderer.on('menu-open-selected-item', (e) => {
  items.open();
});

ipcRenderer.on('menu-delete-selected-item', (e) => {
  const element = items.getSelectedElement();
  if(element) {
    items.deleteItemById(element.dataset.id);
  }
});

ipcRenderer.on('menu-open-in-browser-selected-item', (e) => {
  const element = items.getSelectedElement();
  if(element) {
    shell.openExternal(element.dataset.url);
  }
});

ipcRenderer.on('menu-focus-search', (e) => {
  search.focus();
});

// Navigate thru items with keyboard
document.addEventListener('keydown', e => {
  if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
})