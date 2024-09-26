# Angular-Electron-App-Builder

This repository contains an WalletPlus Angular Electron application setup guide and notes for managing builds and deploying updates.

### Setup Instructions
-   Clone the Repo with latest branch (release/sprint), Navigate to the project directory and install dependencies: `npm install`
-   Copy the production or QA build from the Angular application to the app folder  (usually dist folder).
-   Run the electron app using command `npm run electron:start` and `npm run electron:start-live`
-   Generated exe/dmg based on the OS on which you are running the application`npm run electron:make` will be generated in the exe/dmg in output folder.

- You can change the version in package.json file

### Developer Instructions

-   Install @capacitor-community/electron:
`npm i @capacitor-community/electron`

-   Add Electron support to the project:
`npx cap add electron`

Create capacitor.config.ts in the Electron folder with the following content:
import { CapacitorConfig } from '@capacitor/cli';

``````
 const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Wallet',
  webDir: 'app',
  bundledWebRuntime: false
}; 
``````

Install Electron Builder globally:
`npm i electron-builder -g`

### Auto Update

-   Instructions for Auto Update Feature Setup Copy the .exe and latest.yml files to a remote location.

-   Update electron-builder.config.json with publish locations.

`````` 
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://aws/electron' // Update the proper URL
});
``````

-   autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdatesAndNotify(); // To be reviewed
    
    Ensure to replace placeholder URLs and file paths with actual values before deploying the application.

### Mac App Store Publishing Guidelines for Electron Apps:

Ref: https://www.electronjs.org/docs/latest/tutorial/mac-app-store-submission-guide


### Build Instructions
# Prerequisites:
1. Both Poker-electron and Poker-desktop repositories are cloned
2. NodeJS, Angular, Electron and other necessary libraries are installed
3. Both, the Electron and the Web apps are running fine on your machine (Details are in setup instruction)
4. Windows and Mac machines available for build generation for respective platforms

# Build Steps:
1. Create a web-app build for electron using command `npm run build:electron-qa`
2. Copy the content of folder `dist\poker2` from web-app project to `app` folder in electron project
3. Update/increment electron app version in `package.json` line #3
4. Run the electron app using command `npm run electron:start` and ensure the app is running fine
5. Generate the build using command `npm run electron:make`
6. The build should now be generated in directory `output`
7. Copy the following files from `output` directory to server inside the update directory
  (each file contains the version in it's name, here considering version as 1.0.0 for example)
  On Mac: Adda52_Poker-setup-1.0.0.dmg, Adda52_Poker-setup-1.0.0.dmg.blockmap, Adda52_Poker-setup-1.0.0.zip, Adda52_Poker-setup-1.0.0.zip.blockmap, latest-mac.yml
  On Windows: Adda52_Poker-setup-1.0.0.exe, Adda52_Poker-setup-1.0.0.exe.blockmap, latest.yml
8. The builds are now ready for setup and updates must be available to the existing users using older versions.

### IMP: There is an open issue about electron_updater dependency
Ref: https://github.com/electron-userland/electron-builder/issues/8264
Remove '"skipLibCheck": true' added to tsconfig.json once this issue is resolved
