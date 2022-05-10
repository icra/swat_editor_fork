<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<div v-if="$route.name == 'Stations'">
			<file-header input-file="weather-sta.cli" docs-path="climate">
				Weather Stations
			</file-header>

			<b-alert variant="primary" show class="mb-4">
				<font-awesome-icon :icon="['fas', 'info-circle']" class="mr-1 text-info" />
				Need weather data? 
				<open-in-browser 
					text="See options on the SWAT website."
					url="https://swat.tamu.edu/data/" />
			</b-alert>

			<grid-view ref="stationsGrid" api-url="climate/stations" collection-description="weather stations" item-name="weather station"
				empty-message="Use the buttons below to import data or create a new record manually."
				:fields="table.fields" use-filter @change="getTableTotal"
				:default-sort="table.sort" :default-per-page="table.itemsPerPage"
				:router-link-fields="table.routerLinkFields"
				:file-link-fields="table.fileLinkFields"></grid-view>

			<action-bar>
				<b-button type="button" variant="primary" to="create" append class="mr-1">Create Record</b-button>
				<b-button type="button" variant="info" @click="page.import.show = true">Import Data</b-button>
			</action-bar>

			<b-modal v-model="page.import.show" centered size="lg" title="Import Observed Weather Data" no-close-on-backdrop no-close-on-esc hide-header-close>
				<error-alert :text="page.import.error"></error-alert>			
				<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error importing your weather data." :stack-trace="task.error.toString()" />
				
				<div v-if="task.running">
					<b-progress :value="task.progress.percent" :max="100"></b-progress>
					<p>
						{{task.progress.message}}
					</p>
				</div>
				<div v-else-if="isNullOrEmpty(task.error)">					
					<b-form-group label="Select your data format">
						<b-form-select v-model.trim="$v.page.import.form.format.$model" :options="page.import.options.formats"></b-form-select>
					</b-form-group>

					<b-alert variant="primary" show>
						<div v-if="page.import.form.format === 'SWAT2012'">
							This is not your <code>pcp.pcp</code> (etc); instead you will have a text file for each measurement
							listing each station and its coordinated, and a text file for each station for each measurement.
							These files should be named: <code>pcp.txt</code>, <code>rh.txt</code>, <code>solar.txt</code>, 
							<code>tmp.txt</code>, and <code>wind.txt</code>.
						</div>
						<div v-else>
							SWAT+ formatted weather should have <code>pcp.cli</code>, <code>hmd.cli</code>, <code>slr.cli</code>, 
							<code>tmp.cli</code>, and <code>wnd.cli</code> files.
							See the SWAT+ IO documentation on the <open-in-browser text="SWAT+ website" url="https://swat.tamu.edu/software/plus/" /> for how to format these files.
						</div>
					</b-alert>

					<b-form-group :label="page.import.form.format + ' weather files directory'">
						<select-folder-input required
							v-model.trim="$v.page.import.form.weatherDataDir.$model" :value="page.import.form.weatherDataDir" 
							invalidFeedback="Required" />
					</b-form-group>

					<b-form-group v-if="page.import.form.format !== 'SWAT+'" label="Directory to save your SWAT+ weather files">
						<select-folder-input :required="page.import.form.format !== 'SWAT+'"
							v-model.trim="$v.page.import.form.saveDir.$model" :value="page.import.form.saveDir" 
							invalidFeedback="Required" />
					</b-form-group>

					<div v-if="table.total > 0">
						<b-form-checkbox v-model="page.import.form.deleteExisting">
							Delete existing stations? Leave unchecked to keep.
						</b-form-checkbox>
						<b-form-checkbox v-model="page.import.form.matchExisting">
							Match files to existing stations? Leave unchecked to create new weather stations.
						</b-form-checkbox>
					</div>
				</div>

				<div slot="modal-footer">
					<save-button v-if="isNullOrEmpty(task.error)" :saving="task.running || page.import.saving" text="Start" type="button" @click.native="importData"></save-button>
					<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
				</div>
			</b-modal>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import { runProcess } from '@/plugins/electron-process';
import { required, requiredIf } from 'vuelidate/lib/validators';

export default {
	name: 'Stations',
	mixins: [runProcess],
	data: function() {
		return {
			page: {
				loading: false,
				error: null,
				import: {
					form: {
						deleteExisting: false,
						matchExisting: false,
						weatherDataDir: null,
						saveDir: null,
						format: 'SWAT2012'
					},
					options: {
						formats: [
							{ value: 'SWAT2012', text: 'SWAT2012 / Global Data Websites' },
							{ value: 'SWAT+', text: 'SWAT+' }
						]
					},
					show: false,
					saving: false,
					error: null
				}
			},
			table: {
				sort: 'name',
				itemsPerPage: 100,
				total: 0,
				fields: [
					{ key: 'edit', label: '', class: 'min px-3' },
					{ key: 'name', label: 'Name', sortable: true },
					{ key: 'wgn', label: 'Wgn', sortable: true },
					{ key: 'pcp', label: 'Precipitation', sortable: true },
					{ key: 'tmp', label: 'Temperature', sortable: true },
					{ key: 'slr', label: 'Solar radiation', sortable: true },
					{ key: 'hmd', label: 'Rel. humidity', sortable: true },
					{ key: 'wnd', label: 'Wind speed', sortable: true },
					{ key: 'wnd_dir', label: 'Wind direction', sortable: true },
					{ key: 'atmo_dep', label: 'Atmo. dep.', sortable: true },
					{ key: 'lat', label: 'Lat', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'lon', label: 'Lon', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'delete', label: '', class: 'min px-3' }
				],
				routerLinkFields: [
					{ key: 'wgn', route: '/edit/wgn/edit/' }
				],
				fileLinkFields: [
					{ key: 'pcp', defaultValue: 'sim', filePath: '' },
					{ key: 'tmp', defaultValue: 'sim', filePath: '' },
					{ key: 'slr', defaultValue: 'sim', filePath: '' },
					{ key: 'hmd', defaultValue: 'sim', filePath: '' },
					{ key: 'wnd', defaultValue: 'sim', filePath: '' },
					{ key: 'wnd_dir', defaultValue: 'null', filePath: '' },
					{ key: 'atmo_dep', defaultValue: 'null', filePath: '' }
				]
			},
			boundaries: {
				n: 0,
				s: 0,
				e: 0,
				w: 0
			},
			consts: {
				boundaryFudge: 0.5
			},
			task: {
				progress: {
					percent: 0,
					message: null
				},
				process: null,
				error: null,
				running: false
			}
		}
	},
	validations: {
		page: {
			import: {
				form: {
					format: { required },
					weatherDataDir: { required },
					saveDir: { required: requiredIf(function(){ return this.page.import.form.format === 'SWAT2012'; })},
					matchExisting: {},
					deleteExisting: {}
				}
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`routing_unit/boundaries/${this.projectDbUrl}`);
				this.boundaries = response.data;
				this.boundaries.n += this.consts.boundaryFudge;
				this.boundaries.s -= this.consts.boundaryFudge;
				this.boundaries.e += this.consts.boundaryFudge;
				this.boundaries.w -= this.consts.boundaryFudge;	
				
				const response2 = await this.$http.get(`climate/stations/directory/${this.projectDbUrl}`);
				this.page.import.form.weatherDataDir = response2.data.weather_data_dir;

				if (this.isNullOrEmpty(this.page.import.form.saveDir)) {
					this.page.import.form.saveDir = this.txtInOut;
				}

				if (this.isNullOrEmpty(this.page.import.form.weatherDataDir)) {
					this.page.import.form.weatherDataDir = this.txtInOut;
				}

				for(let i = 0; i < this.table.fileLinkFields.length; i++) {
					this.table.fileLinkFields[i].filePath = this.page.import.form.weatherDataDir;
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
            this.page.loading = false;
		},
		getTableTotal(total) {
			this.table.total = total;
		},
		async importData() {
			this.page.import.error = null;
			this.page.import.saving = true;
			this.log(this.page.import.form);

			this.$v.$touch();
			if (this.$v.$invalid) {
				this.page.import.error = 'Please enter a value for all fields below and try again.';
			} else {
				try {
					let data = {
						weather_data_dir: this.page.import.form.format === 'SWAT+' ? this.page.import.form.weatherDataDir : this.page.import.form.saveDir
					};
					const response = await this.$http.put(`climate/stations/directory/${this.projectDbUrl}`, data);
					this.log(response);
				} catch (error) {
					this.page.import.error = this.logError(error, 'Error saving weather directory to database.');
				}

				if (this.isNullOrEmpty(this.page.import.error)) {
					let deleteExisting = this.page.import.form.deleteExisting ? 'y' : 'n';
					let createStations = this.page.import.form.matchExisting ? 'n' : 'y';
					let importType = this.page.import.form.format === 'SWAT2012' ? 'observed2012' : 'observed';

					let args = ['import_weather', 
						'--project_db_file='+ this.currentProject.projectDb,
						'--delete_existing='+ deleteExisting,
						'--import_type=' + importType,
						'--create_stations='+ createStations];

					if (this.page.import.form.format != 'SWAT+') {
						args.push('--source_dir='+ this.page.import.form.weatherDataDir);
					}

					this.log(args);

					this.$v.$reset();
					this.page.import.saving = false;
					this.runTask(args);
				}
			}

			this.page.import.saving = false;
		},
		runTask(args) {
			this.task.error = null;
			this.task.running = true;
			this.task.progress = {
				percent: 0,
				message: null
			};

			this.task.process = this.getApiProc('swatplus_api', args);

			this.task.process.stdout.on('data', (data) => {
				this.task.progress = this.getApiOutput(data);
			});
			
			this.task.process.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				this.task.error = data;
				this.task.running = false;
			});
			
			this.task.process.on('close', (code) => {
				if (this.isNullOrEmpty(this.task.error)) {
					this.$refs.stationsGrid.get().finally(() => {
						this.task.running = false;
						this.closeTaskModals();
					});
				}
			});
		},
		cancelTask() {
			this.task.error = null;
			if (this.task.process !== null)
				this.task.process.kill();
			
			this.task.running = false;
			this.closeTaskModals();
		},
		closeTaskModals() {
			this.page.import.show = false;
		}
	}
}
</script>