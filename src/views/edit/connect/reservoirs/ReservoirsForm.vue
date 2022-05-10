<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="page.bulk.show">
				<object-selector name="Reservoirs" table="res_con" @change="bulkSelectionChange"></object-selector>
			</div>
			
			<connect-form
				:item="item.connect" :item-outflow="item.outflow" :api-url="apiUrl" outflow-con-id-field="reservoir_con_id"
				:is-update="isUpdate" @change="connectVarsChange"
				:is-bulk-mode="page.bulk.show"></connect-form>

			<hr class="my-4" />

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="init_name" class="d-inline"></b-form-checkbox>
							Initial Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="init_pop" />
						</template>
						<b-popover target="init_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Initial" file="initial.res" db="initial_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.init_name"
							:value="item.props.init_name"
							table-name="init_res" route-name="ReservoirsInitialEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hyd_name" class="d-inline"></b-form-checkbox>
							Hydrology Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hyd_pop" />
						</template>
						<b-popover target="hyd_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Hydrology" file="hydrology.res" db="hydrology_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.hyd_name"
							:value="item.props.hyd_name"
							table-name="hyd_res" route-name="ReservoirsHydrologyEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="sed_name" class="d-inline"></b-form-checkbox>
							Sediment Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="sed_name_pop" />
						</template>
						<b-popover target="sed_name_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Sediment" file="sediment.res" db="sediment_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.sed_name"
							:value="item.props.sed_name"
							table-name="sed_res" route-name="ReservoirsSedimentEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="nut_name" class="d-inline"></b-form-checkbox>
							Nutrients Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="nut_name_pop" />
						</template>
						<b-popover target="nut_name_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Nutrients" file="nutrients.res" db="nutrients_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.nut_name"
							:value="item.props.nut_name"
							table-name="nut_res" route-name="ReservoirsNutrientsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md="6">
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="rel_name" class="d-inline"></b-form-checkbox>
							Release Decision Table
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="rel_name_pop" />
						</template>
						<b-popover target="rel_name_pop" triggers="hover focus">
							<reference-label section="Decision Tables / Reservoir Release" file="res_rel.dtl" db="d_table_dtl" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.rel_name"
							:value="item.props.rel_name"
							table-name="res_rel.dtl" route-name="DecisionsEdit"></type-ahead-and-go>
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
	name: 'ReservoirsForm',
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
			redirectRoute: 'ReservoirsEdit',
			propCol: 'res',
			propFields: [
				'init_name', 'rel_name', 'hyd_name', 'sed_name', 'nut_name'
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
