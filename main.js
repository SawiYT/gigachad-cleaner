const path = require('path');
const os = require('os');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const slash = require('slash');

const { app, BrowserWindow, globalShortcut, ipcMain, shell } = require('electron');
const { is, platform } = require('@electron-toolkit/utils');

let mainWindow; 
const desktopPath = path.join(os.homedir(), 'Gigachad Photos');

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		icon: `${__dirname}/assets/icons/gigachad.png`,
		autoHideMenuBar: true,
		resizable: !is.dev,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.loadURL(`file://${__dirname}/index.html`);
}

app.on('ready', () => {
	createMainWindow();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createMainWindow();
	}
});

ipcMain.on('image:minimize', (e, options) => {
	options.dest = desktopPath;
	gigachadClean(options);
});

async function gigachadClean({ imgPath, quality, dest }) {
	try {
		const imgQuality = quality / 100;

		const files = await imagemin([slash(imgPath)], {
			destination: dest,
			plugins: [
				imageminMozjpeg({ quality }),
				imageminPngquant({
					quality: [imgQuality, imgQuality],
				}),
			],
		});

		console.log(files);
		shell.openPath(dest);
	} catch {}
}

app.on('window-all-closed', () => {
	if (!platform.isMacOS) {
		app.quit();
	}
});
