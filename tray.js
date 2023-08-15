const {app, Tray, Menu} = require('electron');



module.exports = {
  createTray: function (window) {
    const tray = new Tray('./lessons/3. Main Process API/8. Tray/trayTemplate@2x.png');

    tray.setToolTip('app tray tooltip');
    tray.setContextMenu(buildTrayMenu());

    tray.on('click', e => {
      if (e.shiftKey) {
        app.quit();
      } else if(e.ctrlKey) {
        window.isVisible() ? window.hide() : window.show();
      }
    });

    


    return tray;
  }
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    { label: 'Item 1' },
    { role: 'quit' },
  ]);  
}