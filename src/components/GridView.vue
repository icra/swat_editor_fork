<template>
	<div>
		<b-row v-if="useFilter && table.total > 0" class="mb-3" align-v="end">
			<b-col md="6" lg="4">
				<b-form-input v-model="table.filter" placeholder="Search..." @input="filterChg" autofocus></b-form-input>
			</b-col>
			<b-col v-if="useActionBar">
				<div class="text-right">
					Showing {{showingFirst}} - {{showingLast}}
					of {{table.matches}} {{isNullOrEmpty(table.filter) ? 'rows' : 'matches'}}
				</div>
			</b-col>
		</b-row>
		<div v-if="!useActionBar && useTopBar" class="mb-2">
			<b-button v-if="showImportExport" type="button" variant="info" @click="page.import.show = true" class="mr-1">
				Import/Export
			</b-button>
			<router-link v-if="!hideCreate" :to="createRoute" append class="btn btn-primary mr-1">{{createButtonText}}</router-link>
		</div>
		<b-table striped responsive small table-class="table-fixed-height border-bottom table-grid" show-empty sticky-header="70vh"
				:items="items" :busy="table.loading"
				:fields="table.fields"
				:no-local-sorting="true"
				:sort-by.sync="table.sort"
				:sort-desc.sync="table.reverse"
				@sort-changed="sortChg">
			<template v-slot:table-busy>
				<div class="text-center my-4">
					<font-awesome-icon :icon="['fas', 'spinner']" spin size="2x" />
				</div>
			</template>
			<template v-slot:cell(edit)="data">
				<router-link v-if="!hideEdit" :to="editRoute + data.item.id" :append="editRouteAppend" :title="editRoute + data.item.id">
					<font-awesome-icon :icon="['fas', 'edit']" />
				</router-link>
			</template>
			<template v-slot:cell(delete)="data" class="text-right">
				<button v-if="!hideDelete" type="button" class="plain text-danger" title="Delete" @click="askDelete(data.item.id, data.item.name)">
					<font-awesome-icon :icon="['fas', 'times']" />
				</button>
			</template>
			<template v-slot:cell(obj_name)="data">
				<div v-if="data.item.obj_name != null">
					<router-link v-if="getObjTypeRoute(data.item) != '#'" :to="getObjTypeRoute(data.item)">{{ data.item.obj_name }}</router-link>
					<div v-else>{{ data.item.obj_name }}</div>
				</div>
			</template>
			<template v-for="(field, i) in routerLinkFields" v-slot:[cellKey(field.key)]="data">
				<div :key="i">
					<div v-if="data.item[field.key] != null">
						<router-link v-if="field.route != undefined && field.route != '#'" :to="field.route + data.item[field.key].id">{{ data.item[field.key].name }}</router-link>
						<div v-else>{{ data.item[field.key].name }}</div>
					</div>
					<div v-else>null</div>
				</div>
			</template>
			<template v-for="(fileField, j) in fileLinkFields" v-slot:[cellKey(fileField.key)]="data">
				<span :key="j">
					<span v-if="data.item[fileField.key] === fileField.defaultValue || isNullOrEmpty(data.item[fileField.key])">
						{{fileField.defaultValue}}
					</span>
					<span v-else>
						<open-file :file-path="joinPath(fileField.filePath, data.item[fileField.key])" :text="data.item[fileField.key]" />
					</span>
				</span>
			</template>
			<template v-slot:empty>
				<h4 v-if="useFilter && !isNullOrEmpty(table.filter)">No records found matching "{{table.filter}}".</h4>
				<div v-else class="text-center border-dash my-4 mx-4 bg-white">
					<div class="p-4 lead text-muted">
						<router-link v-if="!hideCreate" :to="createRoute" append class="text-muted">
							You don't have any {{collectionDescription}}.
							{{emptyMessage}}
						</router-link>
						<span v-else>
							You don't have any {{collectionDescription}}.
							{{emptyMessage}}
						</span>
					</div>
				</div>
			</template>
			<template v-slot:emptyfiltered>
				<h4>No records found matching "{{table.filter}}".</h4>
			</template>
		</b-table>

		<action-bar v-if="useActionBar">
			<router-link v-if="!hideCreate" :to="createRoute" append class="btn btn-primary mr-1">{{createButtonText}}</router-link>
			<slot></slot>
			<b-button v-if="showImportExport" type="button" variant="info" @click="page.import.show = true">
				Import/Export
			</b-button>
			<b-pagination class="ml-auto mb-0" v-if="table.total > table.itemsPerPage" size="md" :total-rows="table.total" v-model="table.currentPage" :per-page="table.itemsPerPage" @change="pageChg" />
		</action-bar>
		<div v-else class="d-flex align-items-center">
			<b-pagination class="mb-0" v-if="table.total > table.itemsPerPage" size="md" :total-rows="table.total" v-model="table.currentPage" :per-page="table.itemsPerPage" @change="pageChg" />
			<div class="ml-auto">
				Showing {{showingFirst}} - {{showingLast}}
				of {{table.matches}} {{isNullOrEmpty(table.filter) ? 'rows' : 'matches'}}
			</div>
		</div>

		<b-modal v-model="page.delete.show" centered size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.delete.error"></error-alert>

			<p>
				Are you sure you want to delete <strong>{{page.delete.name}}</strong>?
				This action is permanent and cannot be undone.
			</p>

			<div slot="modal-footer">
				<save-button type="button" :saving="page.delete.saving" @click.native="confirmDelete" text="Delete" variant="danger" />
				<b-button type="button" variant="secondary" @click="page.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.import.show" centered size="lg" title="Import/Export Data" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.import.error"></error-alert>
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error importing or exporting your data." :stack-trace="task.error.toString()" />

			<div v-if="task.running" class="text-center p-5">
				<font-awesome-icon :icon="['fas', 'spinner']" spin size="2x" />
			</div>
			<div v-else-if="isNullOrEmpty(task.error)">
				<p>
					Export your existing data to {{importExportDescription}} or import a {{importExportDescription}} file of new values.
					Any existing values in the table with the same name will be updated to match your {{importExportDescription}} data.
					Export data first to get a template with the correct columns.
				</p>

				<div v-if="!isNullOrEmpty(importExportNotes)" class="alert alert-warning mb-3">
					{{importExportNotes}}
				</div>

				<b-form-group>
					<b-form-radio-group buttons button-variant="outline-primary" v-model="page.import.form.type" :options="page.import.options.types" />
				</b-form-group>

				<b-form-group>
					<label for="modal_file_name" v-if="page.import.form.type == 'import_csv'">Select a {{importExportDescription == 'CSV' ? 'CSV (comma delimited)' : importExportDescription}} file to import</label>
					<label for="modal_file_name" v-else>Select where to save your {{importExportDescription == 'CSV' ? 'CSV (comma delimited)' : importExportDescription}} file</label>
					<select-file-input v-model="page.import.form.fileName" :value="page.import.form.fileName" id="modal_file_name"
						:fileType="importExportDescription.toLowerCase()" required :default-file-name="defaultCsvFile" :save-dialog="page.import.form.type == 'export_csv'"
						invalidFeedback="Please select a file." />
				</b-form-group>
			</div>

			<div slot="modal-footer">
				<save-button v-if="isNullOrEmpty(task.error)" :saving="task.running || page.import.saving"
					:text="page.import.form.type === 'export_csv' ? 'Export Data' : 'Import Data'" type="button" @click.native="importData"></save-button>
				<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal ref="exportedModal" v-model="page.exported.show" centered size="md" title="Data Exported" no-close-on-backdrop no-close-on-esc hide-header-close>
			<p>
				Your data has been exported to a {{importExportDescription}} file.
			</p>
			<p>
				<open-file :file-path="page.import.form.fileName" text="Open file" css-class="btn btn-primary" />
			</p>

			<div slot="modal-footer">
				<b-button type="button" variant="secondary" @click="page.exported.show = false">Close</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import _ from 'underscore';
import { runProcess } from '@/plugins/electron-process';

export default {
	name: 'GridView',
	mixins: [runProcess],
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		deleteApiUrl: {
			type: String
		},
		fields: {
			type: Array
		},
		routerLinkFields: {
			type: Array,
			default: () => [{ key: 'none', route: 'none' }]
		},
		fileLinkFields: {
			type: Array,
			default: () => [{ key: 'none', defaultValue: 'null', filePath: '' }]
		},
		useDynamicFields: {
			type: Boolean,
			default: false
		},
		defaultSort: {
			type: String,
			default: 'name'
		},
		defaultReverse: {
			type: Boolean,
			default: false
		},
		defaultPerPage: {
			type: Number,
			default: 20
		},
		collectionName: {
			type: String,
			default: 'items'
		},
		collectionDescription: {
			type: String,
			default: 'items'
		},
		itemName: {
			type: String,
			default: 'item'
		},
		//ICRA Joan Saló
		createRoute: {
			type: String,
			default: 'create'
		},
		editRoute: {
			type: String,
			default: 'edit/'
		},
		editRouteAppend: {
			type: Boolean,
			default: true
		},
		useFilter: {
			type: Boolean,
			default: false
		},
		hideFields: {
			type: Array,
			default: () => ['id']
		},
		emptyMessage: {
			type: String,
			default: 'Use the button below to create a new record.'
		},
		hideEdit: {
			type: Boolean,
			default: false
		},
		hideDelete: {
			type: Boolean,
			default: false
		},
		hideCreate: {
			type: Boolean,
			default: false
		},
		createButtonText: {
			type: String,
			default: 'Create Record'
		},
		useActionBar: {
			type: Boolean,
			default: false
		},
		showImportExport: {
			type: Boolean,
			default: false
		},
		defaultCsvFile: {
			type: String
		},
		tableName: {
			type: String
		},
		importExportDescription: {
			type: String,
			default: 'CSV'
		},
		importExportNotes: {
			type: String
		},
		importExportRelatedId: {
			type: Number,
			default: null
		},
		importExportDeleteExisting: {
			type: Boolean,
			default: false
		},
		useTopBar: {
			type: Boolean,
			default: false
		},
		useDatasetsDb: {
			type: Boolean,
			default: false
		},
		showNameAndDescriptionFirst: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			page: {
				loading: false,
				error: null,
				delete: {
					show: false,
					id: null,
					name: '',
					error: null,
					saving: false
				},
				import: {
					form: {
						fileName: null,
						type: 'export_csv'
					},
					options: {
						types: [
							{ text: 'Import', value: 'import_csv' },
							{ text: 'Export', value: 'export_csv' }
						]
					},
					show: false,
					saving: false,
					error: null
				},
				exported: {
					show: false
				}
			},
			table: {
				loading: false,
				fields: [],
				sort: this.defaultSort,
				reverse: this.defaultReverse,
				currentPage: 1,
				itemsPerPage: this.defaultPerPage,
				total: 0,
				filter: null,
				matches: 0,
				specialSort: null
			},
			items: [],
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
	computed: {
		showingFirst() {
			return (this.table.currentPage-1) * this.table.itemsPerPage + 1
		},
		showingLast() {
			var max = (this.table.currentPage-1) * this.table.itemsPerPage + this.table.itemsPerPage
			return max > this.table.matches ? this.table.matches : max;
		}
	},
	async created() {
		await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		getDb() {
			let reverse = this.table.reverse ? 'y' : 'n';
			let sort = this.isNullOrEmpty(this.table.specialSort) ? this.table.sort : this.table.specialSort;
			let filter = this.useFilter && this.table.filter !== null ? `&filter=${encodeURIComponent(this.table.filter)}` : '';
			let dbUrl = this.useDatasetsDb ? this.datasetsDbUrl : this.projectDbUrl;
			return this.$http.get(`${this.apiUrl}/list/${dbUrl}?sort=${sort}&reverse=${reverse}&page=${this.table.currentPage}&per_page=${this.table.itemsPerPage}${filter}`);
		},
		async get() {
			this.table.loading = true;
			this.page.error = null;

			try {
				const response = await this.getDb();
				this.log(response.data);

				if (response.data[this.collectionName].length == 0 && this.table.currentPage > 1) {
					this.table.currentPage--;
					await this.get();
				}

				this.items = response.data[this.collectionName];
				this.table.total = response.data.total;
				this.table.matches = response.data.matches;
				this.$emit('change', this.table.total);

				//Set table fields
				if (this.items.length > 0) {
					if (this.useDynamicFields) {
						var keys = Object.keys(this.items[0]);
						if (this.showNameAndDescriptionFirst) {
							keys = keys.filter(k => !['name', 'description'].includes(k));
							keys.unshift('description');
							keys.unshift('name');
						}

						for (var i = 0; i < keys.length; i++) {
							if (!this.hideFields.includes(keys[i])) {
								var meta = this.getMeta(keys[i], this.items[0][keys[i]]);
								this.table.fields.push({ key: keys[i], label: meta.label, sortable: true, class: meta.css, formatter: meta.formatter });
							}
						}
					} else {
						this.table.fields = this.fields;
					}

					if (!this.hideEdit) {
						this.table.fields.unshift({ key: 'edit', label: '', class: 'min' });
					}
					if (!this.hideDelete) {
						this.table.fields.push({ key: 'delete', label: '' });
					}
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get ' + this.collectionDescription + ' from database.');
			}

			this.table.loading = false;
		},
		cellKey(key) {
			return `cell(${key})`;
		},
		async filterChg() {
			this.table.currentPage = 1;
			_.debounce(await this.get(), 500);
		},
		async pageChg(page) {
			this.table.currentPage = page;
			await this.get();
		},
		async sortChg(ctx) {
			this.table.sort = ctx.sortBy;
			this.table.reverse = ctx.sortDesc;
			this.table.specialSort = null;

			var prop = this.routerLinkFields.find(o => o.key == ctx.sortBy);
			if (prop != null) {
				this.table.specialSort = ctx.sortBy + '_id';
			}

			await this.get();
		},
		getMeta(field, item) {
			let label = field[0].toUpperCase() + field.substring(1);
			let css = 'text-right';
			let formatter = (value) => { return isNaN(value) || Number.isInteger(Number(value)) ? value : this.numberFormat(value, 3) }

			let textFields = [
				'name',
				'description'
			];

			if (textFields.includes(field) || isNaN(item)) {
				css = 'text-left';
				formatter = undefined;
			}

			return {
				label: label,
				css: css,
				formatter: formatter
			};
		},
		askDelete(id, name) {
			this.page.delete.id = id;
			this.page.delete.name = name;
			this.page.delete.show = true;
		},
		async confirmDelete() {
			this.page.delete.errors = [];
			this.page.delete.saving = true;

			try {
				let url = this.isNullOrEmpty(this.deleteApiUrl) ? this.apiUrl : this.deleteApiUrl;
				const response = await this.$http.delete(`${url}/${this.page.delete.id}/${this.projectDbUrl}`);
				this.log(response);
				this.page.delete.show = false;
				this.table.currentPage = 1;
				await this.get();
			} catch (error) {
				this.page.delete.error = this.logError(error, 'Unable to delete from database.');
			}

			this.page.delete.saving = false;
		},
		getTotal() {
			return this.table.total;
		},
		async importData() {
			this.page.import.error = null;
			this.page.import.saving = true;
			this.log(this.page.import.form);

			if (this.isNullOrEmpty(this.page.import.form.fileName)) {
				this.page.import.error = 'Please select a file below and try again.';
			} else {
				let args = [this.page.import.form.type,
					'--db_file='+ this.currentProject.projectDb,
					'--file_name='+ this.page.import.form.fileName,
					'--table_name='+ this.tableName];

				if (!this.isNullOrEmpty(this.importExportRelatedId)) args.push('--related_id=' + this.importExportRelatedId);
				if (this.importExportDeleteExisting) args.push('--delete_existing=y');
				this.log(args);

				this.runTask(args);
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
				console.log(this.task.progress)
			});

			this.task.process.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				this.task.error = data;
				this.task.running = false;
			});

			this.task.process.on('close', (code) => {
				if (this.isNullOrEmpty(this.task.error)) {
					if (this.page.import.form.type === 'export_csv') {
						this.task.running = false;
						this.closeTaskModals();
						this.page.exported.show = true;
					} else {
						this.get().finally(() => {
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
