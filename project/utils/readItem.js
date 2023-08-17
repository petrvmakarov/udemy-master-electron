const {BrowserWindow} = require('electron');

// ref to offscreen browser to prevent GC on it
let offscreenWindow = null;

module.exports = function (url) {
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  offscreenWindow.loadURL(url);

  const resultPromise = new Promise((resolve, reject) => {
    offscreenWindow.webContents.once('did-fail-load', (e) => {
      console.error(e);
    });

    offscreenWindow.webContents.once('did-finish-load', async (e) => {
      console.log('did-finish-load');
      try {
        const title = offscreenWindow.getTitle();
        const image = await offscreenWindow.webContents.capturePage();
        const screenshot = image.toDataURL();

        resolve({
          title,
          screenshot,
          url,
        });
      } catch (e) {
        console.error(e);
        reject();
      } finally {
        offscreenWindow.close();
        offscreenWindow = null;
      }
    });
  });

  return resultPromise;
}
