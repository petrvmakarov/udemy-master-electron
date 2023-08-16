// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
document.writeln('<h1>this is an output from js</h1>')

const { desktopCapturer, ipcRenderer } = require('electron');


document.getElementById('send').addEventListener('click', (e) => {
  ipcRenderer.send('channel1', {message: 'hello from main window'});
});

ipcRenderer.on('channel1-response', (e, msg) => {
  console.log(msg);
})


document.getElementById('screenshot-button').addEventListener('click', function() {
  desktopCapturer.getSources({types: ['screen'], thumbnailSize: { width: 1920, height: 900 }})
  .then(sources => {
    console.log(sources);

    document.getElementById('screenshot').setAttribute('src', sources[0].thumbnail.toDataURL());
    
  })
});


document.getElementById('ask').addEventListener('click', e => {
  // ipcRenderer.send('ask-fruit');
  ipcRenderer.invoke('ask-fruit').then((fruit) => {
    alert(fruit);
  });
});

ipcRenderer.on('fruit-picked', (e, fruit) => {
  alert(fruit);
})
