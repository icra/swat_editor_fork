import Vue from 'vue';

const customTitlebar = window.require('custom-electron-titlebar');
const remote = window.require('electron').remote;
const shell = window.require('electron').shell;

const tb = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#123c69'),
    icon: '/icons/png/titlebar_icon.png'
});

const menu = new remote.Menu();
menu.append(new remote.MenuItem({
	label: 'File',
	submenu: [
		{ role: 'quit' }
	]
}));

let viewMenu = {
	label: 'View',
	submenu: [
		{role: 'toggledevtools'},
		{type: 'separator'},
		{role: 'togglefullscreen'},
		{role: 'minimize'}
	]
};

if (remote.getGlobal('dev_mode')) {
	viewMenu.submenu.unshift({role: 'forcereload'});
	viewMenu.submenu.unshift({role: 'reload'});
}

menu.append(new remote.MenuItem(viewMenu));

menu.append(new remote.MenuItem({
	role: 'help',
	submenu: [
		{
			label: 'SWAT+ Editor Documentation',
			click () { shell.openExternal('https://swatplus.gitbook.io/docs/') }
		},
		{
			label: 'SWAT Website',
			click () { shell.openExternal('https://swat.tamu.edu') }
		},
		{
			label: 'Report an issue',
			click () { shell.openExternal('https://bitbucket.org/swatplus/swatplus.editor/issues?status=new&status=open') }
		}
	]
}));

tb.updateMenu(menu);

Vue.prototype.$titlebar = tb;