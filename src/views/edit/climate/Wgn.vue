<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<div v-if="$route.name == 'Wgn'">
			<file-header input-file="weather-wgn.cli" docs-path="climate">
				Weather Generator
			</file-header>

			<grid-view ref="wgnGrid" api-url="climate/wgn" collection-description="weather generators" item-name="weather generator"
				empty-message="Use the buttons below to import data or create a new record manually."
				:fields="table.fields" use-filter @change="getTableTotal"
				:default-sort="table.sort" :default-per-page="table.itemsPerPage"></grid-view>

			<action-bar>
				<b-button type="button" variant="primary" to="create" append class="mr-1">Create Record</b-button>
				<b-button type="button" variant="info" @click="page.import.show = true">Import Data</b-button>
			</action-bar>

			<b-modal v-model="page.import.show" centered size="lg" title="Import Weather Generator Data" no-close-on-backdrop no-close-on-esc hide-header-close>
				<error-alert :text="page.import.error"></error-alert>			
				<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error importing your WGN data." :stack-trace="task.error.toString()" />
				
				<div v-if="task.running">
					<b-progress :value="task.progress.percent" :max="100"></b-progress>
					<p>
						{{task.progress.message}}
					</p>
				</div>
				<div v-else-if="isNullOrEmpty(task.error)">					
					<b-form-group label="Select your data format">
						<b-form-select v-model.trim="$v.page.import.form.method.$model" :options="page.import.options.methods"></b-form-select>
					</b-form-group>

					<div v-if="page.import.form.method === 'database'">
						<b-alert variant="primary" :show="isNullOrEmpty(page.import.form.db)">
							Need wgn data? <open-in-browser url="https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_wgn.sqlite" text="Download the global SWAT+ wgn database (300MB)." />
						</b-alert>

						<b-form-group label="Database file">
							<select-file-input v-model.trim="$v.page.import.form.db.$model" :value="page.import.form.db"
								fileType="sqlite" :required="page.import.form.method === 'database'"
								invalidFeedback="Please select a SQLite database file." />
						</b-form-group>

						<b-form-group label="Table name in database" v-if="!isNullOrEmpty(page.import.form.db)">
							<type-ahead
								v-model="page.import.form.table"
								:value="page.import.form.table"
								src=":keyword"
								:fetch="getTableNames"
								:getResponse="getDataResponse" />
						</b-form-group>
					</div>
					<div v-else-if="page.import.form.method === 'two_file'">
						<b-alert variant="primary" show>
							Two CSV files are required. 
							<ol class="mb-0">
								<li>
									Stations CSV file:
									<ul>
										<li>Columns <code>id, name, lat, lon, elev, rain_yrs</code></li>
										<li><code>id</code> should be uniquely numbered</li>
									</ul>
								</li>
								<li>
									Monthly values CSV file:
									<ul>
										<li>Columns <code>id, wgn_id, month, tmp_max_ave, tmp_min_ave, tmp_max_sd, tmp_min_sd, pcp_ave, pcp_sd, pcp_skew, wet_dry, wet_wet, pcp_days, pcp_hhr, slr_ave, dew_ave, wnd_ave</code></li>
										<li><code>id</code> should be uniquely numbered</li>
										<li><code>wgn_id</code> corresponds to the <code>id</code> column from the stations file</li>
									</ul>
								</li>
							</ol>
						</b-alert>

						<b-form-group label="Stations CSV file">
							<select-file-input v-model.trim="$v.page.import.form.csvFile1.$model" :value="page.import.form.csvFile1" 
								fileType="csv" :required="page.import.form.method === 'two_file'"
								invalidFeedback="Please select a csv file." />
						</b-form-group>
						<b-form-group label="Monthly values CSV file"> 
							<select-file-input v-model.trim="$v.page.import.form.csvFile2.$model" :value="page.import.form.csvFile2" 
								fileType="csv" :required="page.import.form.method === 'two_file'"
								invalidFeedback="Please select a csv file." />
						</b-form-group>
					</div>

					<b-form-checkbox v-model="page.import.form.deleteExisting" v-if="table.total > 0">
						Delete existing weather generators? 
					</b-form-checkbox>

					<b-form-checkbox v-model="page.import.form.useObserved">
						Check if you are using <strong>observed weather data</strong>
					</b-form-checkbox>
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
	name: 'Wgn',
	mixins: [runProcess],
	data() {
		return {
			page: {
				loading: false,
				error: null,
				import: {
					defaults: {
						db: 'C:/SWAT/SWATPlus/Databases/swatplus_wgn.sqlite',
						table: 'wgn_cfsr_world'
					},
					form: {
						method: 'database',
						csvFile1: null,
						csvFile2: null,
						db: null,
						table: null,
						useObserved: false,
						deleteExisting: true
					},
					options: {
						methods: [
							{ text: 'Database', value: 'database' },
							{ text: 'CSV files', value: 'two_file' }
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
				fields: [
					{ key: 'edit', label: '', class: 'min px-3' },
					{ key: 'name', label: 'Name', sortable: true },
					{ key: 'lat', label: 'Latitude', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'lon', label: 'Longitude', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'elev', label: 'Elevation (m)', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'rain_yrs', label: 'Rain years', sortable: true, class: 'text-right' },
					{ key: 'delete', label: '', class: 'min px-3' }
				],
				total: 0
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
					method: { required },
					csvFile1: { required: requiredIf(function(){ return this.page.import.form.method === 'two_file'; })},
					csvFile2: { required: requiredIf(function(){ return this.page.import.form.method === 'two_file'; })},
					db: { required: requiredIf(function(){ return this.page.import.form.method === 'database'; })},
					table: { required: requiredIf(function(){ return this.page.import.form.method === 'database'; })},
					useObserved: {},
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
				const response = await this.$http.get(`climate/wgn/db/${this.projectDbUrl}`);
				this.log(response.data);

				/*let defaultDb = this.page.import.defaults.db;
				let defaultTable = this.page.import.defaults.table;
				if (!this.pathExists(defaultDb)) {
					defaultDb = null;
					defaultTable = null;
				}*/
				let defaultDb = this.wgnDbPath;
				let defaultTable = this.isNullOrEmpty(defaultDb) ? null : this.page.import.defaults.table

				this.page.import.form.db = this.valueIfNull(response.data.wgn_db, defaultDb);
				this.page.import.form.table = this.valueIfNull(response.data.wgn_table_name, defaultTable);
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
            this.page.loading = false;
		},
		getTableNames: function(query) {
			return this.$http.get(`climate/wgn/db/tables/autocomplete/${query}/${encodeURIComponent(this.page.import.form.db)}`);
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
				if (this.page.import.form.method === 'database') {
					try {
						let data = {
							wgn_db: this.page.import.form.db,
							wgn_table_name: this.page.import.form.table
						};
						const response = await this.$http.put(`climate/wgn/db/${this.projectDbUrl}`, data);
						this.log(response);
					} catch (error) {
						this.page.import.error = this.logError(error, 'Error saving wgn database and table parameters.');
					}
				}

				if (this.isNullOrEmpty(this.page.import.error)) {
					let deleteExisting = this.page.import.form.deleteExisting ? 'y' : 'n';
					let createStations = this.page.import.form.useObserved ? 'n' : 'y';

					let args = ['import_weather', 
						'--project_db_file='+ this.currentProject.projectDb,
						'--delete_existing='+ deleteExisting,
						'--import_type=wgn',
						'--create_stations='+ createStations,
						'--import_method='+ this.page.import.form.method,
						'--file1='+ this.page.import.form.csvFile1,
						'--file2='+ this.page.import.form.csvFile2];
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
					this.$refs.wgnGrid.get().finally(() => {
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