<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="page.bulk.show">
				<object-selector name="Objects" table="exco_con" no-gis @change="bulkSelectionChange"></object-selector>
			</div>
			
			<connect-form
				:item="item.connect" :item-outflow="item.outflow" :api-url="apiUrl" outflow-con-id-field="exco_con_id"
				:is-update="isUpdate" @change="connectVarsChange"
				:is-bulk-mode="page.bulk.show"></connect-form>

			<hr class="my-4" />

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="om_name" class="d-inline"></b-form-checkbox>
							Organic Mineral Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="org_min_pop" />
						</template>
						<b-popover target="org_min_pop" triggers="hover focus">
							<reference-label section="Export Coefficients / Organic Mineral" file="exco_om.exc" db="exco_om_exc" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.om_name"
							:value="item.props.om_name"
							table-name="om_exc" route-name="ExcoOMEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="pest_name" class="d-inline"></b-form-checkbox>
							Pesticide Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="pest_pop" />
						</template>
						<b-popover target="pest_pop" triggers="hover focus">
							<reference-label section="Export Coefficients / Pesticides" file="exco_pest.exc" db="exco_pest_exc" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.pest_name"
							:value="item.props.pest_name"
							table-name="pest_exc" route-name="#"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="path_name" class="d-inline"></b-form-checkbox>
							Pathogen Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="path_pop" />
						</template>
						<b-popover target="path_pop" triggers="hover focus">
							<reference-label section="Export Coefficients / Pathogens" file="exco_path.exc" db="exco_path_exc" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.path_name"
							:value="item.props.path_name"
							table-name="path_exc" route-name="#"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hmet_name" class="d-inline"></b-form-checkbox>
							Heavy Metal Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hmet_pop" />
						</template>
						<b-popover target="hmet_pop" triggers="hover focus">
							<reference-label section="Export Coefficients / Heavy Metals" file="exco_hmet.exc" db="exco_hmet_exc" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.hmet_name"
							:value="item.props.hmet_name"
							table-name="hmet_exc" route-name="#"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="salt_name" class="d-inline"></b-form-checkbox>
							Salt Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="salt_pop" />
						</template>
						<b-popover target="salt_pop" triggers="hover focus">
							<reference-label section="Export Coefficients / Salt" file="exco_salt.exc" db="exco_salt_exc" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.salt_name"
							:value="item.props.salt_name"
							table-name="salt_exc" route-name="#"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

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
	name: 'ExcoForm',
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
			redirectRoute: 'ExcoEdit',
			propCol: 'exco',
			propFields: [
				'om_name', 'pest_name', 'path_name', 'hmet_name', 'salt_name'
			],
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
            selectedConnectVars: []
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
				return this.$http.put(`${this.apiUrl}/properties/${this.item.props.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`${this.apiUrl}/properties/post/${this.projectDbUrl}`, data);
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
					
					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
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
						const response = await this.$http.put(`${this.apiUrl}/properties/many/${this.projectDbUrl}`, item);
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
		}
	}
}
</script>
