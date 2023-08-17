// Modules
const { ipcRenderer } = require('electron');

// Dom nodes
const showModal = document.getElementById('show-modal'),
      closeModal = document.getElementById('close-modal'),
      modal = document.getElementById('modal'),
      addItem = document.getElementById('add-item'),
      itemUrl = document.getElementById('url');

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
ipcRenderer.on('new-item-success', (e, {url}) => {
  console.log('item in renderer', {url});
  toggleModalButtons();
  closeModal.click();
})