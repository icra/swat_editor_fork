const DEV_MODE = require('electron-is-dev');
global.dev_mode = DEV_MODE;
global.is_linux = process.platform == 'linux';
global.platform = process.platform;

const { app, BrowserWindow, Menu, dialog } = require('electron');

const path = require('path');
const url = require('url');
const portfinder = require('portfinder');
const axios = require('axios');
const { autoUpdater } = require('electron-updater');
const windowStateKeeper = require('electron-window-state');
const parseArgs = require('electron-args');

const appsettings = require(path.join(__dirname, 'appsettings.json'));

app.allowRendererProcessReuse = true;
autoUpdater.autoDownload = false;
let updatableOS = process.platform === 'win32';
let checkFromMenu = false;

const cli = parseArgs(`
		swatpluseditor
 
		Usage
			$ swatpluseditor [path_to_project_database]
 
		Options
			--help                      show help
			--version                   show version
			--cmd-only                  run in command line only mode (all options following are for this mode)
			--weather-dir               full path of weather files location (required if --cmd-only)
			--weather-import-format     weather files import format (plus or old; default plus)
			--weather-save-dir          if weather files import format is old, provide the path to save your plus weather files (defaults to input files directory)
			--wgn-import-method         weather generator import method (database or csv; default database)
			--wgn-db                    full path of wgn database (defaults to default install location)
			--wgn-table                 table name in wgn database (default wgn_cfsr_world)
			--wgn-csv-sta-file          wgn stations csv file, if import method = csv
			--wgn-csv-mon-file          wgn monthly values csv file, if import method = csv
			--year-start                starting year of simulation (defaults to weather files dates)
			--day-start                 starting day of simulation (defaults to weather files dates)
			--year-end                  ending year of simulation (defaults to weather files dates)
			--day-end                   ending day of simulation (defaults to weather files dates)
			--input-files-dir           full path of where to write input files (defaults to Scenarios/Default/TxtInOut)
 
		Examples
			$ swatpluseditor path/to/project-database.sqlite
			$ swatpluseditor path/to/project-database.sqlite --cmd-only --weather-dir=path/to/weather_files
`, {
		alias: {
			h: 'help'
		},
		default: {
			cmdOnly: false,
			weatherDir: '',
			weatherImportFormat: 'plus',
			weatherSaveDir: null,
			wgnImportMethod: 'database',
			wgnDb: 'C:/SWAT/SWATPlus/Databases/swatplus_wgn.sqlite',
			wgnTable: 'wgn_cfsr_world',
			wgnCsvStaFile: null,
			wgnCsvMonFile: null,
			yearStart: null,
			dayStart: null,
			yearEnd: null,
			dayEnd: null,
			inputFilesDir: null
		}
});
global.cmd_settings = { project_db: cli.input[0] };

let indexUrl;
if (DEV_MODE) {
	indexUrl = 'http://localhost:8080/';
} else {
	indexUrl = url.format({
		pathname: path.join(__dirname, 'dist/index.html'),
		protocol: 'file:',
		slashes: true
	});
}

let win = null;
let pythonProcess = null;

const getScriptPath = (scriptName = 'swatplus_rest_api') => {
	if (DEV_MODE) {
		return path.join(__dirname, 'api', scriptName + '.py')
	} else if (appsettings.python) {
		return path.join(__dirname, 'api', scriptName + '.py').replace('app.asar', 'app.asar.unpacked')
	} else {
		if (global.platform === 'darwin') return path.join(__dirname, 'api_dist', scriptName, scriptName).replace('app.asar', 'app.asar.unpacked')
		return path.join(__dirname, 'api_dist', scriptName).replace('app.asar', 'app.asar.unpacked')
	}
}

function exitPythonProcess() {
	if (pythonProcess) {
		if (DEV_MODE) {
			pythonProcess.kill();
		} else {
			axios.get('http://localhost:' + global.api_port + '/shutdown')
				.then(res => {
					pythonProcess.kill();
				})
				.catch(err => {});
		}
		pythonProcess = null;
	}
}

app.on('will-quit', exitPythonProcess);

app.on('ready', () => {
	if (cli.flags.cmdOnly) {
		let linux_suf = '';
		if (global.platform === 'linux') linux_suf = '_linux';
		else if (global.platform === 'darwin') linux_suf = '_mac';
		const swat_exe = path.join(__dirname, 'swat_exe', 'rev' + appsettings.swatplus + '_64rel' + linux_suf).replace('app.asar', 'app.asar.unpacked');

		var script_args = [
			'run',
			'--project_db_file=' + cli.input[0],
			'--editor_version=' + appsettings.version,
			'--swat_exe_file=' + swat_exe,
			'--weather_dir=' + cli.flags.weatherDir,
			'--weather_import_format=' + cli.flags.weatherImportFormat,
			'--wgn_import_method=' + cli.flags.wgnImportMethod,
			'--wgn_db=' + cli.flags.wgnDb,
			'--wgn_table=' + cli.flags.wgnTable
		]

		if (cli.flags.weatherSaveDir !== null) script_args.push('--weather_save_dir=' + cli.flags.weatherSaveDir);
		if (cli.flags.wgnCsvStaFile !== null) script_args.push('--wgn_csv_sta_file=' + cli.flags.wgnCsvStaFile);
		if (cli.flags.wgnCsvMonFile !== null) script_args.push('--wgn_csv_mon_file=' + cli.flags.wgnCsvMonFile);
		if (cli.flags.yearStart !== null) script_args.push('--year_start=' + cli.flags.yearStart);
		if (cli.flags.dayStart !== null) script_args.push('--day_start=' + cli.flags.dayStart);
		if (cli.flags.yearEnd !== null) script_args.push('--year_end=' + cli.flags.yearEnd);
		if (cli.flags.dayEnd !== null) script_args.push('--day_end=' + cli.flags.dayEnd);
		if (cli.flags.inputFilesDir !== null) script_args.push('--input_files_dir=' + cli.flags.inputFilesDir);

		let script = getScriptPath('swatplus_api');

		if (DEV_MODE || appsettings.python) {
			script_args.unshift(script);
			pythonProcess = require('child_process').spawn(appsettings.pythonPath, script_args);
		} else {
			pythonProcess = require('child_process').spawn(script, script_args);
		}

		console.log(script);
		console.log(script_args);

		pythonProcess.stdout.on('data', (data) => {
			console.log(data.toString());
		});
		
		pythonProcess.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
		});
		
		pythonProcess.on('close', (code) => {
			console.log('Done.');
			app.quit();
		});
	} else {
		let script = getScriptPath();

		portfinder.basePort = 5000;
		portfinder.getPortPromise()
			.then((port) => {
				global.api_port = port;
				
				if (DEV_MODE || appsettings.python) {
					pythonProcess = require('child_process').spawn(appsettings.pythonPath, [script, port]);
				} else {
					pythonProcess = require('child_process').spawn(script, [port]);
				}
			
				if (pythonProcess != null) {
					console.log('SWAT+ API started: ' + port + ', process ID: ' + pythonProcess.pid);
				} else {
					console.log('SWAT+ API failed to start.');
				}

				if (DEV_MODE) {
					require('vue-devtools').install();
				}
			
				let mainWindowState = windowStateKeeper({
					defaultWidth: 1200,
					defaultHeight: 800
				});
			
				// Initialize the window to our specified dimensions
				win = new BrowserWindow({
					width: mainWindowState.width, 
					height: mainWindowState.height,
					x: mainWindowState.x,
					y: mainWindowState.y,
					title: 'SWAT+ Editor',
					icon: path.join(__dirname, 'public/icons/ico/256x256.ico'),
					webPreferences: { nodeIntegration: true },
					//frame: false
				});

				mainWindowState.manage(win);			
				win.loadURL(indexUrl);
			
				if (updatableOS && !DEV_MODE) {
					autoUpdater.checkForUpdates();
				}
			
				// Remove window once app is closed
				win.on('closed', function () {
					win = null;
				});
			
				win.webContents.on('will-navigate', ev => {
					ev.preventDefault()
				});
			})
			.catch((err) => {
				console.log('Could not find port: ' + err);
			});
	}
});

//Auto updates
function sendStatusToWindow(text) {
	win.webContents.send('message', text);
}

function sendClearStatusToWindow(text) {
	win.webContents.send('clearMessage', text);
}

autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
	sendClearStatusToWindow('Update available.');

	let message = 'If you download now, it will run in the background and you will be prompted when it is ready to install.';
	if (info.releaseNotes) {
		const splitNotes = info.releaseNotes.split(/[^\r]\n/);
		message += '\n\nRelease notes:\n';
		splitNotes.forEach(notes => {
			message += notes + '\n\n';
		});
	}
	// Ask user to update the app
	dialog.showMessageBox({
		type: 'question',
		buttons: ['Download Update', 'Later'],
		defaultId: 0,
		title: 'Update Available',
		message: 'SWAT+ Editor ' + info.version + ' is available.',
		detail: message
	}, response => {
		if (response === 0) {
			autoUpdater.downloadUpdate();
		}
	});
});

autoUpdater.on('update-not-available', (info) => {
	sendClearStatusToWindow('Update not available.');
	if (checkFromMenu) {
		dialog.showMessageBox({
			type: 'info',
			title: 'No Update',
			message: 'No update is available.'
		});
	}
});

autoUpdater.on('error', (err) => {
	sendClearStatusToWindow('Error checking for update: ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + Math.ceil(progressObj.percent) + '%';
	log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
	sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
	sendClearStatusToWindow('Update downloaded.');

	dialog.showMessageBox({
		type: 'question',
		buttons: ['Install Now', 'Later'],
		defaultId: 0,
		title: 'Install Update?',
		message: 'Update ready to install.',
		detail: 'Click to install now or later when you close and relaunch the application.'
	}, response => {
		if (response === 0) {
			autoUpdater.quitAndInstall();
		}
	});
});

//Set Menu
const template = [
	{
		label: 'File',
		submenu: [
			{role: 'quit'}
		]
	},
	{
		label: 'Edit',
		submenu: [
			{role: 'undo'},
			{role: 'redo'},
			{type: 'separator'},
			{role: 'cut'},
			{role: 'copy'},
			{role: 'paste'}
		]
	},
	{
		label: 'View',
		submenu: [
			//{role: 'reload'},
			//{role: 'forcereload'},
			{role: 'toggledevtools'},
			{type: 'separator'},
			{role: 'resetzoom'},
			{role: 'zoomin'},
			{role: 'zoomout'},
			{type: 'separator'},
			{role: 'togglefullscreen'},
			{role: 'minimize'}
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'SWAT+ Editor Documentation',
				click () { require('electron').shell.openExternal('https://swatplus.gitbook.io/docs/') }
			},
			{
				label: 'SWAT Website',
				click () { require('electron').shell.openExternal('https://swat.tamu.edu') }
			},
			{
				label: 'Report an issue',
				click () { require('electron').shell.openExternal('https://bitbucket.org/swatplus/swatplus.editor/issues?status=new&status=open') }
			}
		]
	}
];

if (DEV_MODE) {
	template[2].submenu.unshift({role: 'forcereload'});
	template[2].submenu.unshift({role: 'reload'});
}

if (!DEV_MODE && updatableOS) {
	template[3].submenu.push({
		label: 'Check for updates...',
		click () { checkFromMenu = true; autoUpdater.checkForUpdates(); }
	});
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);