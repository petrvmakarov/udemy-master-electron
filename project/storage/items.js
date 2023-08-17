const fs = require('fs'); 

let items = document.getElementById("items");

const idGenerator = new IdGenerator();

const readerJS = fs.readFileSync(`${__dirname}/../scripts/reader.js`).toString();

const LS_ITEMS_KEY = "readit-items";

const storage = (JSON.parse(localStorage.getItem(LS_ITEMS_KEY)) || [])/*.map(addId)*/;
// localStorage.setItem(LS_ITEMS_KEY, JSON.stringify(storage));

exports.storage = storage;

window.addEventListener('message', e => {
  if (e.data.type === 'item-done') {
    const itemId = e.data.payload;    
    exports.deleteItemById(itemId);
    e.source.close();
  }
});

exports.save = () => {
  localStorage.setItem(LS_ITEMS_KEY, JSON.stringify(this.storage));
};

exports.addItem = ({ title, screenshot, url }) => {
  const item = { title, screenshot, url, id:idGenerator.newId() };
  
  makeItemDomNodeAndAppend(item);
  this.storage.push(item);

  this.save();
};

exports.select = (e) => {
  Array.from(document.getElementsByClassName("read-item selected")).forEach(
    (i) => {
      i.classList.remove("selected");
    }
  );

  e.currentTarget.classList.add('selected');
};

exports.changeSelection = (key) => {
  const selectedArray = Array.from(document.getElementsByClassName("read-item selected"));
  let elementToSelect = null;
  if (selectedArray.length === 0) {
    elementToSelect = document.getElementsByClassName("read-item")[0];    
  } else {    
    switch(key) {
      case 'ArrowUp':
        elementToSelect = selectedArray[0].previousElementSibling;
        break;
      case 'ArrowDown':
        elementToSelect = selectedArray[0].nextElementSibling;
        break;
    }
  }
  if (elementToSelect) {
    this.select({currentTarget: elementToSelect});
  }
}

exports.open = () => {
  if (!this.storage.length) {
    return;
  }
  const selected = Array.from(document.getElementsByClassName("read-item selected"))[0];
  if (!selected) {
    return;
  }
  
  const url = selected.dataset.url;

  const readerWin = window.open(url, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `);

  readerWin.eval(readerJS.replace('{SELECTED_ID}', selected.dataset.id));

}

exports.deleteItemById = (id) => {
  const item = storage.find(e => e.id === id);  
  const element = Array.from(document.getElementsByClassName("read-item")).find(e => e.dataset.id === id);

  if (item) {
    this.storage = this.storage.filter(i => i.id !== id);
    this.save();
  }
  if (element) {
    element.parentElement.removeChild(element);
  }
}

function makeItemDomNodeAndAppend({ title, screenshot, url, id }) {
  if (!id) {
    throw new Error('id is required');
  }
  const itemNode = document.createElement("div");

  itemNode.setAttribute("class", "read-item");

  itemNode.setAttribute('data-url', url);
  itemNode.setAttribute('data-id', id);

  itemNode.innerHTML = `<img src="${screenshot}"><h2>${title}</h2>`;

  items.appendChild(itemNode);

  itemNode.addEventListener('click', exports.select);
  itemNode.addEventListener('dblclick', exports.open);
}

this.storage.forEach(e => makeItemDomNodeAndAppend(e));

function IdGenerator() {
  let id = 1;
  return {
    newId: () => `${(new Date()).getTime()}-${id++}`,    
  }
}

function addId(i) {
  if(!i.id) {
    i.id = idGenerator.newId();
  }
  return i;
}
