const selectedId = '{SELECTED_ID}';
const readitClose = document.createElement('div');
readitClose.innerText = 'Done';

readitClose.style.position = 'fixed';
readitClose.style.bottom = '15px';
readitClose.style.right = '15px';
readitClose.style.padding = '5px 10px';
readitClose.style.fontSize = '20px';
readitClose.style.fontWeight = 'bold';
readitClose.style.background = 'dodgerblue';
readitClose.style.color = 'white';
readitClose.style.borderRadius = '5px';
readitClose.style.cursor = 'default';
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
readitClose.style.zIndex = '9999';

readitClose.onclick = e => {  
  window.opener.postMessage({type: 'item-done', payload: selectedId}, '*');
  window.close();
}

document.getElementsByTagName('body')[0].append(readitClose);
