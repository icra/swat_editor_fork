<template>
	<project-container>
		<div v-if="$route.name == 'Recall'">
			<file-header input-file="recall.con" docs-path="connections/recall">
				Point Source / Inlet Data
			</file-header>

			<p>
				In SWAT+, constant values for point sources and inlets are stored in the export coefficients properties file, exco.exc, while time series data are stored entirely in the recall section.
				However, in the editor, we keep both time series and constant recall and export coefficients in the same section. When you write input files, the editor will write to the appropriate files.
			</p>
			<p>
				QSWAT+ automatically generates an empty point source location for each channel in your model. We recommend keeps all of these points in your model. They will not be used unless you update the data yourself.
				If keeping constant point source data, flow will need to be greater than 0 in order to be read by the model. Click a point below to modify its data, or use the import/export button at the bottom of the page.
			</p>

			<connect-grid-view ref="recallGrid"
				api-url="recall"
				collection-description="recall records"
				:fields="fields" :router-link-fields="routerLinkFields">
				<b-button type="button" variant="info" class="mr-1" @click="page.import.show = true">Import/Export Data</b-button>
			</connect-grid-view>

			<b-modal v-model="page.import.show" centered size="lg" title="Import/Export Data" no-close-on-backdrop no-close-on-esc hide-header-close>
				<error-alert :text="page.import.error"></error-alert>
				<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error importing or exporting your data." :stack-trace="task.error.toString()" />

				<div v-if="task.running">
					<b-progress :value="task.progress.percent" :max="100"></b-progress>
					<p>
						{{task.progress.message}}
					</p>
				</div>
				<div v-else-if="isNullOrEmpty(task.error)">
					<p>
						Use the toggle below to import constant or time series CSV files,
						or to export your existing data to a directory.
					</p>

					<b-form-group>
						<b-form-radio-group buttons button-variant="outline-primary" v-model="page.import.type" :options="page.import.options.types" />
					</b-form-group>

					<div v-if="page.import.type === 'import_csv'">
						<b-alert variant="primary" show>
							<p>
								Provide a directory containing a CSV file for each recall object. For time series data, each file should be named for the object's name, e.g.,
								object <code>pt001</code> should have a file in the directory <code>pt001.csv</code>.
								</p>
								<p>
								Time series files may be daily, monthly, or yearly. <strong>Make sure your simulation dates fall within the dates of your data.</strong>
								Not all recall objects need to be the same time step.
								You do not need to have a time series file or constant record for each recall object. Just leave it out of the directory to ignore.
								</p>
								<p>
								Constant data should be contained in a single CSV file named <code>recall.csv</code>.
								The first column should be the name of each record.
								</p>
								<p class="mb-0">
								To get templates for the time step you desire, we recommend clicking a row in the recall table, change the time step as needed,
								save changes, then return to this form and export the data to CSV. For additional help,
								<open-in-browser url="https://swatplus.gitbook.io/docs/user/editor/inputs/connections/recall" text="view the documentation online" />.
							</p>
						</b-alert>

						<b-form-group label="Directory containing your recall CSV files">
							<select-folder-input :required="page.import.type === 'import_csv'"
								v-model="page.import.inputDir" :value="page.import.inputDir"
								invalidFeedback="Required" />
						</b-form-group>
					</div>
					<div v-else>
						<b-form-group label="Directory to save your recall CSV files">
							<select-folder-input :required="page.import.type === 'export_csv'"
								v-model="page.import.exportDir" :value="page.import.exportDir"
								invalidFeedback="Required" />
						</b-form-group>
					</div>
				</div>

				<div slot="modal-footer">
					<save-button v-if="isNullOrEmpty(task.error)" :saving="task.running" :text="page.import.type === 'export_csv' ? 'Export Data' : 'Import Data'" type="button" @click.native="importData"></save-button>
					<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
				</div>
			</b-modal>

			<b-modal v-model="page.exported.show" centered size="md" title="Data Exported" no-close-on-backdrop no-close-on-esc hide-header-close>
				<p>
					Your data has been exported.
				</p>
				<p>
					<open-file :file-path="page.import.exportDir" text="Open directory" css-class="btn btn-primary" />
				</p>

				<div slot="modal-footer">
					<b-button type="button" variant="secondary" @click="page.exported.show = false">Close</b-button>
				</div>
			</b-modal>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import { runProcess } from '@/plugins/electron-process';

export default {
	name: 'Recall',
	mixins: [runProcess],
	data () {
		return {
			fields: [
				{ key: 'rec_typ', label: 'Time Step', sortable: true, class: 'text-right', formatter: (value) => { return value == 1 ? 'Daily' : (value == 2 ? 'Monthly' : (value == 3 ? 'Yearly' : 'Constant')) } }
			],
			routerLinkFields: [],
			page: {
				import: {
					show: false,
					saving: false,
					error: null,
					inputFile: null,
					inputDir: null,
					exportDir: null,
					type: 'import_csv',
					options: {
						formats: [
							{ value: 'rec_cnst', text: 'Constant' },
							{ value: 'rec_dat', text: 'Time Series' }
						],
						types: [
							{ text: 'Import', value: 'import_csv' },
							{ text: 'Export', value: 'export_csv' }
						]
					}
				},
				exported: {
					show: false
				}
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
	methods: {
		importData() {
			this.page.import.error = null;
			this.page.import.saving = true;

			if (this.page.import.type === 'export_csv') {
				if (this.isNullOrEmpty(this.page.import.exportDir)) {
					this.page.import.error = 'Please select a directory to save your data.';
				} else {
					let args = ['export_recall',
							'--db_file='+ this.currentProject.projectDb,
							'--delete_existing=n',
							'--input_files_dir=' + this.page.import.exportDir];

					this.runTask(args);
				}
			}
			else {
				if (this.isNullOrEmpty(this.page.import.inputDir)) {
					this.page.import.error = 'Please select a directory containing your data.';
				} else {
					let args = ['import_recall',
							'--db_file='+ this.currentProject.projectDb,
							'--delete_existing=y',
							'--input_files_dir=' + this.page.import.inputDir];

					this.runTask(args);
				}
			}
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
					if (this.page.import.type === 'export_csv') {
						this.task.running = false;
						this.closeTaskModals();
						this.page.exported.show = true;
					} else {
						this.$refs.recallGrid.get().finally(() => {
							this.task.running = false;
							this.closeTaskModals();
						});
					}
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
