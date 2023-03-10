/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import {
  ensureDir,
  lstatSync,
  outputFile,
  existsSync,
  readdirSync,
  readFileSync,
  removeSync,
  writeFileSync,
} from 'fs-extra';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { readExcelData } from './excelOperations';
import * as Excel from 'exceljs';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const userDataPath = app.getPath('userData');
const templatesDir = path.join(userDataPath, 'Templates');

const withoutBrackets = (text: string) => {
  const without = text;
  return without.replace('[', '').replace(']', '');
};
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.handle('reload', () => {
  mainWindow!.reload();
});

ipcMain.handle('createFile', (_, { fileName, content }) => {
  const name = fileName === '' ? 'Bez_nazwy.html' : `${fileName}.html`;
  const filePath = path.join(templatesDir, name);
  ensureDir(templatesDir);
  if (existsSync(filePath)) {
    if (lstatSync(filePath).isFile()) {
      alert(`Plik o nazwie ${name} istnieje!`);
      return false;
    }
  }

  outputFile(filePath, content, () => {
    return false;
  });

  return true;
});

ipcMain.handle('getContent', async () => {
  const isHTML = /.*\.html/;
  const htmlFiles = readdirSync(templatesDir).filter((file) =>
    isHTML.test(file)
  );
  const response = htmlFiles.reduce((prev, name) => {
    const content: string = readFileSync(path.join(templatesDir, name), {
      encoding: 'utf8',
    });
    return { ...prev, [name.replace('.html', '')]: content };
  }, {});

  return response;
});

ipcMain.handle('removeFile', (_, name) => {
  const filePath = path.join(templatesDir, `${name}.html`);
  if (existsSync(filePath)) {
    if (lstatSync(filePath).isFile()) {
      removeSync(filePath);
      return true;
    }
  }
  return false;
});

ipcMain.handle('createExcel', async (_, name) => {
  const filePath = path.join(templatesDir, `${name}.html`);
  console.log(filePath);
  if (existsSync(filePath)) {
    if (lstatSync(filePath).isFile()) {
      const content = readFileSync(filePath, {
        encoding: 'utf8',
      });

      const checkForQR = /<canvas.*/;
      const hasQR = checkForQR.test(content) ? 'id' : null;
      const matches = content.match(/\[[A-Z0-9]*\]/gm);
      const brackets = matches ? matches : [];
      const tags: string[] = [hasQR!, ...brackets];
      if (tags.length > 0) {
        const directionPath = dialog.showSaveDialogSync({
          title: 'Wzór',
          buttonLabel: 'Stwórz',
        });
        if (directionPath) {
          if (directionPath) {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('tagi');

            worksheet.columns = tags.map((tag) => {
              return { header: tag, key: withoutBrackets(tag) };
            }) as unknown as Partial<Excel.Column>[];
            const indexRow = tags.reduce((prev, tag) => {
              return { ...prev, [withoutBrackets(tag)]: tag };
            }, {});
            workbook.xlsx.writeFile(`${directionPath}.xlsx`);
          }
        }
      }
    }
  }
});

ipcMain.handle('makeFromTemplates', async (_, name) => {
  const filePath = path.join(templatesDir, `${name}.html`);
  if (existsSync(filePath)) {
    if (lstatSync(filePath).isFile()) {
      const selectedExcel = dialog.showOpenDialogSync({
        buttonLabel: 'Wybierz wzór',
        properties: ['openFile'],
        filters: [{ name: 'all', extensions: ['xlsx'] }],
      });
      if (selectedExcel) {
        const [excelPath] = selectedExcel;
        const response = await readExcelData(excelPath);
        if (response) {
          const directionPath = dialog.showSaveDialogSync({
            title: 'Folder na zdjęcia',
            buttonLabel: 'Stwórz',
          });
          if (directionPath) {
            ensureDir(directionPath);

            return { response, directionPath };
          }
        }
      }
    }
  }
});

ipcMain.handle(
  'saveImage',
  async (
    _,
    {
      file,
      directionPath,
      index,
    }: { file: Buffer; directionPath: string; index: number }
  ) => {
    const imgPath = path.join(directionPath, `${index}card.png`);
    writeFileSync(imgPath, file);
  }
);
