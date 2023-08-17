let items = document.getElementById('items');

const LS_ITEMS_KEY = 'readit-items';

exports.storage = JSON.parse(localStorage.getItem(LS_ITEMS_KEY)) || [];

exports.save = () => {
  localStorage.setItem(LS_ITEMS_KEY, JSON.stringify(this.storage));
}

exports.addItem = ({title, screenshot, url}) => {
  makeItemDomNodeAndAppend({title, screenshot, url});

  this.storage.push({title, screenshot, url});
  
  this.save();
}

function makeItemDomNodeAndAppend({title, screenshot, url}) {
  const itemNode = document.createElement('div');

  itemNode.setAttribute('class', 'read-item');

  itemNode.innerHTML = `<img src="${screenshot}"><h2>${title}</h2>`;

  items.appendChild(itemNode);
}

this.storage.forEach(makeItemDomNodeAndAppend);