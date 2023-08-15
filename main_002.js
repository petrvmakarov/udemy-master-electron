// Modules
const {app, BrowserWindow, webContents, session} = require('electron');
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
    //frame: false,
    //titleBarStyle: 'hidden',
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

  const customSession = session.fromPartition('persist:customSession');

  secondaryWindow = new BrowserWindow({
    width: 1000, height: 1000,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
      // session: customSession,
      partition: 'persist:customSession3',
    }
  })

  secondaryWindow.loadFile('index2.html')
  secondaryWindow.webContents.openDevTools();
  // setTimeout(() => {
  //   secondaryWindow.show();
  //  setTimeout(() => secondaryWindow.hide(), 3000);
  // }, 2000);

  // Load index.html into the new BrowserWindow
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://saxotrader.com/go')

  //mainWindow.loadURL('https://httpbin.org/basic-auth/user/passwd')
  
  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();
    
  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  secondaryWindow.on('closed',  () => {
    secondaryWindow = null
  })

  const ses = mainWindow.webContents.session;

  console.log({session: ses})

  wc.on('did-finish-load', () => {
    console.log('Content fully loaded');
     session.defaultSession.cookies.get({}).then(cookies => {
    console.log({cookies});
  })
  });

  wc.on('dom-ready', () => {
    console.log('DOM ready');
  });

  wc.on('new-window', (e, url) => {
    e.preventDefault();
    console.log(`Preventing new window to open for: ${url}`);
    // console.log(`Creating new window for: ${url}`);
  });

  wc.on('before-input-event', (e, input) => {
    console.log(`${input.key}: ${input.type}`);
  });

  wc.on('did-navigate', (e, url, statusCode, message) => {
    console.log(`Navigated to: ${url}`);
    console.log(`Status code: ${statusCode}, message: ${message}`);
  });

  wc.on('login', (e, request, authInfo, callback) => {
    console.log('Logging in:')
    callback('username', 'password');
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
