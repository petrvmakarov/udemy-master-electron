// Modules
const {app, BrowserWindow, webContents} = require('electron');
const windowStateKeeper = require('electron-window-state');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, secondaryWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  let winState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 100,
  });

  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
    x: winState.x, y: winState.y,
    minHeight: 270,
    minWidth: 500,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  winState.manage(mainWindow);

  let wc = mainWindow.webContents;

  console.log({webContents: webContents.getAllWebContents() });

  secondaryWindow = new BrowserWindow({
    width: 600, height: 300,
    webPreferences: { nodeIntegration: true },
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,    
  });

  // setTimeout(() => {
  //   secondaryWindow.show();
  //  setTimeout(() => secondaryWindow.hide(), 3000);
  // }, 2000);

  // Load index.html into the new BrowserWindow
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://httpbin.org/basic-auth/user/password')
  // secondaryWindow.loadFile('index2.html')
  secondaryWindow.loadURL('https://httpbin.org/basic-auth/user/password')

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })

  secondaryWindow.on('closed',  () => {
    secondaryWindow = null
  })

  wc.on('did-finish-load', () => {
    console.log('Content fully loaded');
  })

  wc.on('dom-ready', () => {
    console.log('DOM ready');
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
