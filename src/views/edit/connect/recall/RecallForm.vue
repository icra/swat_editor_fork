<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="page.bulk.show">
				<object-selector name="Recall" table="rec_con" @change="bulkSelectionChange"></object-selector>
			</div>

			<connect-form
				:item="item.connect" :item-outflow="item.outflow" :api-url="apiUrl" outflow-con-id-field="rtu_con_id"
				:is-update="isUpdate" @change="connectVarsChange"
				:is-bulk-mode="page.bulk.show"></connect-form>

			<hr class="my-4" />

			<b-form-group>
				<template slot="label">
					<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="rec_typ" class="d-inline"></b-form-checkbox>
					Time Step
				</template>
				<b-form-select v-model="item.props.rec_typ" :options="recTypOptions" required @change="changedRecTyp = true" />
			</b-form-group>

			<!-- ICRA Joan Saló -->
			<b-alert variant="warning" :show="isUpdate && changedRecTyp && (dataTotal > 0 || dataPollutantTotal > 0)">
				Warning: changing the time step will delete any existing data for the record.
				Please export it first if you need to retain it. Click the save changes button before modifying any data below.
			</b-alert>

			<div v-if="isUpdate && !page.bulk.show">
				<h2 class="my-3">Data</h2>
				<grid-view ref="dataGrid"
					:api-url="`recall/data/items/${item.props.id}`"
					delete-api-url="recall/data/item"
					collection-description="recall data"
					default-sort="yr"
					use-dynamic-fields @change="getTableTotal" :hide-fields="['id','recall_rec']"
					use-top-bar create-button-text="Add Data Manually"
					:show-import-export="originalRecTyp !== 4" :hide-create="originalRecTyp === 4 && dataTotal > 0"
					empty-message="Use the buttons above to add data."
					default-csv-file="recall.csv" table-name="rec_dat"
					:import-export-related-id="item.props.id" import-export-delete-existing />

				<!-- ICRA Joan Saló  -->
				<h2 class="my-3">Pollutants</h2>
				<grid-view ref="dataGrid"
						   :api-url="`recall_pollutants/data/items/join/${item.props.id}`"
						   :delete-api-url="`recall_pollutants/data/item/${item.props.id}`"
						   collection-description="pollutant in this point source"
						   default-sort="yr"
						   use-dynamic-fields @change="getTablePollutantTotal" :hide-fields="['id','recall_rec', 'name_to_id_recall_pollutants_dat']"
						   use-top-bar create-button-text="Add Data Manually"
						   :show-import-export="originalRecTyp !== 4" :hide-create="originalRecTyp === 4 && dataPollutantTotal > 0"
						   empty-message="Use the buttons above to add data."
						   default-csv-file="recall.csv" table-name="rec_dat"
						   :import-export-related-id="item.props.id" import-export-delete-existing
						   create-route="create_pollutant" edit-route="edit_pollutant/"/>
			</div>

			<action-bar>
				<div v-if="page.bulk.show">
                    <save-button :saving="page.saving" text="Save Bulk Changes" />
                    <b-button variant="secondary" @click="page.bulk.show = false; page.error = null">Exit Bulk Edit Mode</b-button>
                </div>
                <div v-else>
                    <b-dropdown v-if="allowBulkEdit" split :disabled="page.saving" split-button-type="submit" variant="primary" text="Save Changes" class="mr-1">
                        <b-dropdown-item @click="page.bulk.show = true">Make changes to multiple records...</b-dropdown-item>
                    </b-dropdown>
                    <save-button :saving="page.saving" v-else />
                    <back-button />
                </div>
			</action-bar>
		</b-form>
	</div>
</template>

<script>
import ConnectForm from '@/components/ConnectForm.vue';
import ObjectSelector from '@/components/ObjectSelector.vue';

export default {
	name: 'RecallForm',
	components: {
		ConnectForm, ObjectSelector
	},
	props: {
		apiUrl: {
			type: String,
			required: true
		},
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		allowBulkEdit: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			redirectRoute: 'RecallEdit',
			propCol: 'rec',
			propFields: [],
			page: {
				error: null,
				validated: false,
				saving: false,
                bulk: {
                    show: false
				}
			},
            selectedItems: [],
            selectedVars: [],
			selectedConnectVars: [],
			recTypOptions: [
				{ value: 1, text: 'Daily' },
				{ value: 2, text: 'Monthly' },
				{ value: 3, text: 'Yearly' },
				{ value: 4, text: 'Constant' }
			],
			changedRecTyp: false,
			originalRecTyp: this.item.props.rec_typ,
			dataTotal: 0,
			dataPollutantTotal: 0, //ICRA Joan Saló
		}
	},
	methods: {
		putConnectDb(data) {
			if (this.isUpdate)
				return this.$http.put(`${this.apiUrl}/${this.item.connect.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`${this.apiUrl}/post/${this.projectDbUrl}`, data);
		},
		putPropsDb(data) {
			if (this.isUpdate)
				return this.$http.put(`${this.apiUrl}/data/${this.item.props.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`${this.apiUrl}/data/post/${this.projectDbUrl}`, data);
		},
		async save() {
			this.log(this.item);
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;
			let val_error = false;

			if (this.item.connect.elev === '') this.item.connect.elev = null;
			if (this.item.connect.wst_name === '') this.item.connect.wst_name = null;
			for (let field of this.propFields) {
				if (this.item.props[field] === '') this.item.props[field] = null;
			}

			if (!this.page.bulk.show) {
				let name = this.validName(this.item.connect.name);
				this.item.props.name = name;
				this.item.connect.name = name;

				if (this.isUpdate)
					this.item.connect[`${this.propCol}_id`] = this.item.props.id;

				try {
					const response = await this.putPropsDb(this.item.props);
					if (!this.isUpdate)
						this.item.connect[`${this.propCol}_id`] = response.data.id;

					const response2 = await this.putConnectDb(this.item.connect);
					this.page.validated = false;

					if (this.isUpdate) {
						this.$bvToast.show('changes-saved');
						await this.$refs.dataGrid.get();
						this.changedRecTyp = false;
						this.originalRecTyp = this.item.props.rec_typ;
					} else
						this.$router.push({ name: this.redirectRoute, params: { id: response2.data.id } });
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			} else {
				let selectedVars = this.selectedConnectVars.concat(this.selectedVars);
				if (this.selectedItems.length < 1) {
                    this.page.error = 'You must select at least one record to edit.';
                }
                else if (selectedVars.length < 1) {
                    this.page.error = 'You must check at least one field to edit.';
                }
                else {
                    let item = {};
                    item.selected_ids = this.selectedItems;

                    for (let v of this.selectedConnectVars) {
                        item[v] = this.item.connect[v];
					}
					for (let v of this.selectedVars) {
                        item[v] = this.item.props[v];
					}

					try {
						this.log(item);
						const response = await this.$http.put(`${this.apiUrl}/data/many/${this.projectDbUrl}`, item);
						this.page.validated = false;
						this.$bvToast.show('changes-saved');
					} catch (error) {
						this.page.error = this.logError(error, 'Unable to save changes to database.');
					}
                }
			}

			this.page.saving = false;
		},
		bulkSelectionChange(selection) {
			this.selectedItems = selection;
		},
		connectVarsChange(selection) {
			this.selectedConnectVars = selection;
		},
		getTableTotal(total) {
			this.dataTotal = total;
		},
		//ICRA Joan Saló
		getTablePollutantTotal(total) {
			this.dataPollutantTotal = total;
		}
	}
}
</script>
