// Modules to control application life and create native browser window
const {app, BrowserWindow, BrowserView, ipcMain } = require('electron')
const path = require('path')

const WINDOW_WIDTH = 1400;
const WINDOW_HEIGHT = 600;
const TOPBAR_HEIGHT = 50;
const SIDEBAR_WIDTH = 160;

const unsafeLocalPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
  sandbox: false,
}

const safeRemotePreferences = {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,

    webPreferences: {
      ...unsafeLocalPreferences,
    },
  });

  const rendererView = new BrowserView({
    webPreferences: {
      ...unsafeLocalPreferences,
    },
  });

  rendererView.webContents.on('will-navigate', (e) => {
    console.log(e);
    e.preventDefault();
  });

  rendererView.webContents.loadFile(path.join(__dirname, 'renderer.html'));

  const tabView = new BrowserView({
    webPreferences: {
      ...safeRemotePreferences,

      // Adding transparent: false modifies the behavior of the bug. With transparent: false, it will
      // not return to normal following navigating to a page that is not affected by the bug and back.
      // transparent: false,
    },
  });

  ipcMain.on('load-url', (e, url) => {
    tabView.webContents.loadURL(url);
  });

  tabView.webContents.loadURL('https://news.ycombinator.com');

  mainWindow.addBrowserView(rendererView);
  mainWindow.addBrowserView(tabView);

  rendererView.setBounds({
    x: 0,
    y: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  });

  tabView.setBounds({
    x: SIDEBAR_WIDTH,
    y: TOPBAR_HEIGHT,
    width: WINDOW_WIDTH - SIDEBAR_WIDTH,
    height: WINDOW_HEIGHT - TOPBAR_HEIGHT,
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.