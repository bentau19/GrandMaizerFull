const {app, BrowserWindow, Menu, ipcMain, dialog  } = require('electron');
const yt = require("yt-converter");
let win;
console.warn("main proccess");

function createWindow(){
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 800,
        height: 900,
        resizable: false,
        backgroundColor:"#1c184e",
        // frame: false
    })
    win.loadFile("index.html");
    
    // makes the inspect launch at start
    // win.webContents.openDevTools();
}

const onData = () => {};

const onFinish = () => {
    // telling the frontend stop loading text
    win.webContents.send('downloadFinished');
}

// functionality of the youtube downloader
ipcMain.on('download-function', (event, downloadData) => {
    const conversionOptions = {
        url: downloadData.dLink,
        itag: 140,
        directoryDownload: downloadData.dDir,
        title: downloadData.dName
      };
    yt.convertAudio(conversionOptions, onData, onFinish);
});

ipcMain.on('show-save-dialog', (event) => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (!mainWindow) return;
  
    dialog.showOpenDialog(mainWindow, {
      properties: [ 'openDirectory'],
    })
      .then(result => {
        console.log(result.filePaths)
        if (!result.canceled && result.filePaths) {

          event.reply('save-file-path', result.filePaths);
        }
      })
      .catch(err => {
        console.log('Error while showing save dialog:', err);
      });
  });

app.whenReady().then(createWindow)



