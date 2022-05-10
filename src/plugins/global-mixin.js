import Vue from 'vue';
import { mapGetters } from 'vuex';
const remote = window.require('electron').remote;
const fs = window.require('fs');
const path = window.require('path');
const Store = window.require('electron-store');
const store = new Store();

let platform = remote.getGlobal('platform');
let __dirname = remote.app.getAppPath();
const appsettings = window.require(path.join(__dirname, 'appsettings.json').replace('app.asar', 'app.asar.unpacked'));

Vue.mixin({
	data() {
		return {
            version: null,
            swatplus: null,
            python: false,
            pythonPath: null,
            platform: platform,
			objTypeRouteTable: {
				'hru': { path: '/edit/hrus/edit/', name: 'HrusEdit' },
				'hlt': { path: '/edit/hrus-lte/edit/', name: 'HrusLteEdit' },
				'ru': { path: '/edit/routing_unit/edit/', name: 'RoutingUnitEdit' },
				'aqu': { path: '/edit/aquifers/edit/', name: 'AquifersEdit' },
				'cha': { path: '/edit/channels/edit/', name: 'ChannelsEdit' },
				'res': { path: '/edit/reservoirs/edit/', name: 'ReservoirsEdit' },
				'rec': { path: '/edit/recall/edit/', name: 'RecallEdit' },
				'exc': { path: '/edit/exco/edit/', name: 'ExcoEdit' },
				'dr': { path: '/edit/dr/edit/', name: 'DelratioEdit' },
				'out': { path: '#', name: '#' },
                'mfl': { path: '#', name: '#' },
                'sdc': { path: '/edit/channels/edit/', name: 'ChannelsEdit' }
			},
			noObjTypeRoutes: [
				'hlt', 'rec', 'out', 'mfl'
			],
			objTypeToConTable: {
				'hru': 'hru_con',
				'hlt': 'hru_lte_con',
				'ru': 'rtu_con',
				'aqu': 'aqu_con',
				'cha': 'cha_con',
				'res': 'res_con',
				'rec': 'rec_con',
				'exc': 'exco_con',
				'dr': 'dr_con',
				'out': 'out_con',
                'mfl': 'modflow_con',
                'sdc': 'chandeg_con'
			},
            commonMessages: {
                leaveWarning: 'Click to view details. Warning: any unsaved changes on this page will be lost!'
            }
		}
	},
	created() {
        this.version = appsettings.version;
        this.swatplus = appsettings.swatplus;
        this.python = appsettings.python;
        this.pythonPath = appsettings.pythonPath;         
	},
	computed: {
		...mapGetters(['currentProject']),
		projectDbUrl() {
			if (this.currentProject === null) return null;
			return encodeURIComponent(this.currentProject.projectDb);
        },
        datasetsDbUrl() {
            if (this.currentProject === null) return null;
			return encodeURIComponent(this.currentProject.datasetsDb);
        },
        hasCurrentProject() {
            return !(this.currentProject === undefined || this.currentProject.projectDb === null);
        },
        currentProjectSupported() {
            if (!this.hasCurrentProject) return false;
            let versionSupport = this.getVersionSupport(this.currentProject.version);
            return versionSupport.supported;
        },
		getValidState() {
			return (prop) => {
				return prop.$dirty ? !prop.$error : null;
			}
		},
		requiredFeedback() {
			return (prop) => {
				if (!prop.required) return 'Required';
			}
        },
        txtInOut() {
            if (!this.hasCurrentProject) return null;
            let d = path.dirname(this.currentProject.projectDb);
            let txtinout = path.join(d, 'Scenarios', 'Default', 'TxtInOut');

            if (!fs.existsSync(txtinout))
                txtinout = d;

            return txtinout;
        },
        appPath() {
            return remote.app.getAppPath().replace('app.asar', 'app.asar.unpacked');
        },
        projectPath() {
            return path.dirname(this.currentProject.projectDb);
        },
        wgnDbPath() {
            let appPath = this.appPath;
            let installPath = path.join(appPath, '../../../Databases/swatplus_wgn.sqlite');
            let installPathMac = path.join(appPath, '../../../../../Databases/swatplus_wgn.sqlite');
            this.log(`WGN Install Path: ${installPath}`);
            let searchPaths = [
                installPath,
                installPathMac,
                'C:/SWAT/SWATPlus/Databases/swatplus_wgn.sqlite'
            ];

            for (let p of searchPaths) {
                if (this.pathExists(p)) return p;
            }

            return null;
        }
	},
	methods: {
		setWindowTitle() {
            var title = `SWAT+ Editor ${this.version}`;
            if (this.currentProject !== undefined && !this.isNullOrEmpty(this.currentProject.name))  title += ' / ' + this.currentProject.name;// + ' (' + this.currentProject.projectDb + ')';
            remote.getCurrentWindow().setTitle(title);
            //this.$titlebar.updateTitle(title);
        },
        isNullOrEmpty(value, checkNullStr=false) {
            return value === '' || value === null || value === undefined || (checkNullStr && value === 'null');
        },
        valueIfNull(v, d) {
            return this.isNullOrEmpty(v) ? d : v;
        },
        pathExists(path) {
            return this.isNullOrEmpty(path) ? false : fs.existsSync(path);
        },
        joinPaths(path1, path2) {
            return path.join(path1, path2);
        },
		getAutoComplete(type, name) {
			if (this.isNullOrEmpty(name))
				return this.$http.get(`autocomplete-np/${type}/${this.projectDbUrl}`);
			return this.$http.get(`autocomplete/${type}/${name}/${this.projectDbUrl}`);
		},
		getAutoCompleteId(type, name) {
			return this.$http.get(`autocomplete/id/${type}/${name}/${this.projectDbUrl}`);
		},
		getDataResponse(response) {
			return response.data;
		},
        getVersionSupport(version) {
            let support = {
                supported: false,
                updatable: false,
                error: null
            };

            if (this.version === null) {
                support.error = 'Software version is not set.';
            }
            else if (this.version === version) {
                support.supported = true;
            }
            else {
                let softwareMajor = Number(this.version.substring(0, 3));
                let myMajor = Number(version.substring(0, 3));

                if (softwareMajor > myMajor) {
                    support.updatable = true;
                    support.error = `Your project was made using an earlier version of SWAT+ Editor. Your project is version ${version} and the editor is version ${this.version}.`;
                } else if (softwareMajor < myMajor) {
                    support.supported = true;
                    support.error = `Your project was made using a version of SWAT+ Editor that is greater than the current version. Your project is version ${version} and the editor is version ${this.version}. You may encounter errors if the model has changed. Proceed at your own risk.`;
                } else {
                    support.supported = true;
                }
            }
            this.log(support);
            return support;
        },
        validName(name) {
            if (this.isNullOrEmpty(name)) return name;
            return name.replace(/ /g,"_");
        },
        validFileName(name) {
            return name.replace(/([^a-z0-9]+)/gi, '');
        },
        capitalizeFirstLetter(s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        logError(error, defaultMessage='') {
            console.log(error);
            var message = '';

            if (error.response) {
                console.log(error.response);
                var r = error.response;
                message = r.data != null && r.data.message != null ? r.data.message : '';
            } else if (error.data) {
                console.log(error.data);
                message = error.data.message != null ? error.data.message : '';
            } else if (error.request) {
                console.log(error.request);
            }

            if (message == '' && defaultMessage == '')
                return null;

            return defaultMessage + ' ' + message;
        },
		numberWithCommas(x) {
			var parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		},
		numberFixed(num, decimals) {
			if (this.isNullOrEmpty(num)) return num;
			return num.toFixed(decimals);
		},
		numberFormat(value, decimals = 1, units = '', ifNull = '') {
            if (this.isNullOrEmpty(value)) return ifNull;
			return this.numberWithCommas(Number(value).toFixed(decimals)) + units;
		},
		roundNumber(num) {
			return Math.round((num + Number.EPSILON) * 100) / 100;
        },
        toDecimals(val, precision) {
            return Number(val.toFixed(precision));
        },
		isDevMode() {
			return process.env.NODE_ENV === 'development';
		},
		log(message) {
			if (this.isDevMode()) {
				console.log(message);
			}
		},
        addSetting(key, value) {
            store.set(key, value);
        },
        getSetting(key) {
            return store.get(key);
        },
        deleteSetting(key) {
            store.delete(key);
        },
        getMostRecentProject() {
            let recent = store.get('recentProjects');
            if (recent === undefined || recent.length < 1) return undefined;
            return recent[0];
        },
        pushRecentProject(project) {
            let recent = store.get('recentProjects');
            this.log(recent);
            this.log(project);
            if (recent === undefined) recent = [];

            let exists = recent.filter(function(el) { return el.projectDb === project.projectDb; })[0];
            this.log(exists);
            if (exists) {
                let newProjects = recent.filter(function(el) { return el.projectDb !== project.projectDb; });
                newProjects.unshift(project);

                if (newProjects.length > 4)
                    newProjects.pop();

                store.set('recentProjects', newProjects);
            }

            if (exists === undefined) {
                recent.unshift(project);

                if (recent.length > 4)
                    recent.pop();

                store.set('recentProjects', recent);
            }
        },
        deleteRecentProject(project) {
            let recent = store.get('recentProjects');
            if (recent === undefined)
                recent = [];

            let filtered = recent.filter(function(el) { return el.projectDb !== project.projectDb; });
            store.set('recentProjects', filtered);
            this.log('removed');
            this.log(filtered);
            return filtered;
        },
        getRecentProjects() {
            let recent = store.get('recentProjects');
            if (recent === undefined) recent = [];
            return recent;
        },
        getPieChart(title, data, seriesLabel = 'Area') {
            return {
                plotOptions: { pie: { dataLabels: { enabled: false }, showInLegend: true } },
                title: { text: title },
                tooltip: { pointFormat: '{series.name}: <b>{point.percentage:,.1f}% ({point.y:,.1f} ha)</b>' },
                series: [{ data: data, name: seriesLabel, type: 'pie' }]
            };
        },
		joinPath: function(filePath, fileName) {
			if (this.isNullOrEmpty(filePath))
				return fileName;
				
			return path.join(filePath, fileName);
		},
		getObjTypeRoute(item) {
			let route = this.objTypeRouteTable[item.obj_typ].path;
			if (route === '#')
				return route;

			if ('obj_id' in item)
				return route + item.obj_id;
			else if ('obj_typ_no' in item)
				return route + item.obj_typ_no;

			return '#';
        },
        setToNameProp(item) {
            if (this.isNullOrEmpty(item)) return '';
            return item['name'];
        },
        setVars(item, vars) {
            let keys = Object.keys(vars);
            for (let k of keys) {
                let v = vars[k];
                item[k] = v.type == 'string' ? v.default_text : v.default_value;
            }
            return item;
        },
		async exit() {
			await this.$http.get('shutdown');
			remote.app.quit();
        }
	}
})