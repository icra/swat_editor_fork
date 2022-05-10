const remote = window.require('electron').remote;
const path = window.require('path');

let DEV_MODE = remote.getGlobal('dev_mode');
let __dirname = remote.app.getAppPath();

export const runProcess = {
    methods: {
        getApiPath(script_name) {
			if (DEV_MODE) {
				return path.join(__dirname, 'api', script_name + '.py');
			} else if (this.python) {
				return path.join(__dirname, 'api', script_name + '.py').replace('app.asar', 'app.asar.unpacked');
			} else {
				if (this.platform === 'darwin') return path.join(__dirname, 'api_dist', script_name, script_name).replace('app.asar', 'app.asar.unpacked');
				return path.join(__dirname, 'api_dist', script_name).replace('app.asar', 'app.asar.unpacked');
			}
		},
		getApiProc(script_name, args) {
			let script = this.getApiPath(script_name);
			if (DEV_MODE || this.python) {
				args.unshift(script);
				return window.require('child_process').spawn(this.pythonPath, args);
			} else {
				return window.require('child_process').spawn(script, args);
			}
		},
		getApiOutput(data) {
			let empty_obj = {
				percent: 0,
				message: undefined
			};

			try {
				let san = data.toString().split(/\r?\n/)
				if (san.length > 0) {
					if (san[san.length - 1] == '')
						san.pop(); 
					if (san.length > 0 && san[san.length - 1] != '')
						return JSON.parse(san[san.length - 1]);
				}
				return empty_obj;
			} catch(err) {
				return empty_obj;
			}
		},
		getSwatExeFile(debug) {
			let d = debug ? 'debug' : 'rel';
			if (this.platform === 'linux') d += '_linux';
			else if (this.platform === 'darwin') d += '_mac';

			return path.join(__dirname, 'swat_exe', 'rev' + this.swatplus + '_64' + d).replace('app.asar', 'app.asar.unpacked');
		},
		getSwatProc(inputDir, debug) {
			let swatExe = this.getSwatExeFile(debug);
			return window.require('child_process').spawn(swatExe, [], { cwd: inputDir, maxBuffer: 1024 * 1024 * 1024 });
		},
        resultsPath(inputDir) {
			if (this.isNullOrEmpty(inputDir)) return '';
            let d = inputDir.replace(/\\/g,"/");
			let resultsPath = path.join(d, '../', 'Results');

			if (!this.pathExists(resultsPath))
                resultsPath = inputDir;

            return resultsPath;
        },
        outputDbPath(inputDir) {
            return path.join(this.resultsPath(inputDir), 'swatplus_output.sqlite');
        }
    }
};