const os = require('os');
const path = require('path');
const { ipcRenderer } = require('electron');

const form = document.getElementById('image-form');
const slider = document.getElementById('slider');
const img = document.getElementById('img');

const desktopPath = path.join(os.homedir(), 'Gigachad Photos');

document.getElementById('output-path').innerText = desktopPath;

form.addEventListener('submit', e => {
	e.preventDefault();

	const imgPath = img.files[0].path;
	const quality = slider.value;

	ipcRenderer.send('image:minimize', {
		imgPath,
		quality,
	});
});
