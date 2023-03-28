// main.js
const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const loadURL = serve({ directory: 'build' });

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    loadURL(win);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});