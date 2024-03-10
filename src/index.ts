import type { CapacitorElectronConfig } from '@capacitor-community/electron';
import { getCapacitorElectronConfig, setupElectronDeepLinking } from '@capacitor-community/electron';
import type { MenuItemConstructorOptions, MessageBoxOptions } from 'electron';
import { app, dialog, MenuItem } from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';
import { autoUpdater } from 'electron-updater';

import { ElectronCapacitorApp, setupContentSecurityPolicy, setupReloadWatcher } from './setup';

// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
  { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// Run Application
(async () => {
  // autoUpdater.autoDownload = false; 
  
  // Wait for electron app to be ready.
  await app.whenReady();
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.

  // TODO: Enable once Update is available
  // autoUpdater.setFeedURL({
  //   provider: 'generic',
  //   url: 'https://walletplus.in/electron' // This url is for testing purpose. Please update the proper url. And in electron-builder.config.json file too. Same url to be updated in publish section
  // });
  // autoUpdater.checkForUpdates();
  autoUpdater.checkForUpdatesAndNotify(); // TODO: Need to check
})();

/* Auto Update Code Start */
const dialogOpts: MessageBoxOptions = {
  type: 'error',
  title: 'Notice',
  buttons: ['Close'],
  message: ''
}

autoUpdater.on('update-available', (info) => {
  console.log(info);
  dialogOpts.message = `Update Info: ${info.version}`;
  dialog.showMessageBox(dialogOpts);
  autoUpdater.downloadUpdate();
});

// let currentDialog = null;
// autoUpdater.on('download-progress', (progressObj) => {
  // const { percent } = progressObj;
  // const mainWindow = myCapacitorApp.getMainWindow();
  // mainWindow.webContents.executeJavaScript(`localStorage.setItem("downloadPercentage", "${Math.round(percent)}")`, true)
  // if(percent){
  //   // const roundedPercent = Math.round(percent);
  //   // if (roundedPercent % 1 === 0) {
  //     // Close the current dialog before opening a new one
  //     if (currentDialog && typeof currentDialog.close === 'function') {
  //       currentDialog.close();
  //     }
  //     dialogOpts.message = `Downloading: ${percent}%`;
  //     currentDialog = dialog.showMessageBox(dialogOpts);
  //   // }
  // }
// });

autoUpdater.on('update-downloaded', (info) => {
  // dialogOpts.message = `Downloaded : ${info.version}`;
  // dialog.showMessageBox(dialogOpts);
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  console.log(err);
  // For testing purpose
  dialogOpts.message = `Error test: ${err}`;
  dialog.showMessageBox(dialogOpts);
})

/** Auto Update code End */

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

// Place all ipc or other electron api calls and custom functionality under this line
