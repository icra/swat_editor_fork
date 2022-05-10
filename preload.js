const path = require('path');
const url = require('url');

const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
	const titlebar = new customTitlebar.Titlebar({
		backgroundColor: customTitlebar.Color.fromHex('#123c69'),
		/*icon: url.format(path.join(__dirname, 'public/icons/png/256x256.png')),*/
	});

	const replaceText = (selector, text) => {
		const element = document.getElementById(selector)
		if (element) element.innerText = text
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type])
	}
})