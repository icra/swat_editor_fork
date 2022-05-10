<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="page.bulk.show">
				<object-selector name="HRUs" table="hru_con" @change="bulkSelectionChange" is-hru></object-selector>
			</div>
			
			<connect-form
				:item="item.connect" :item-outflow="item.outflow" :api-url="apiUrl" outflow-con-id-field="hru_con_id"
				:is-update="isUpdate" @change="connectVarsChange"
				:is-bulk-mode="page.bulk.show"></connect-form>

			<hr class="my-4" />

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="topo_name" class="d-inline"></b-form-checkbox>
							Topography Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="topo_name_pop" />
						</template>
						<b-popover target="topo_name_pop" triggers="hover focus">
							<reference-label section="Hydrology / Topography" file="topography.hyd" db="topography_hyd" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.topo_name"
							:value="item.props.topo_name"
							table-name="topo" route-name="TopographyEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hyd_name" class="d-inline"></b-form-checkbox>
							Hydrology Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hyd_name_pop" />
						</template>
						<b-popover target="hyd_name_pop" triggers="hover focus">
							<reference-label section="Hydrology" file="hydrology.hyd" db="hydrology_hyd" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.hyd_name"
							:value="item.props.hyd_name"
							table-name="hyd" route-name="HydrologyEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="soil_name" class="d-inline"></b-form-checkbox>
							Soil Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="soil_name_pop" />
						</template>
						<b-popover target="soil_name_pop" triggers="hover focus">
							<reference-label section="Soils" file="soils.sol" db="soils_sol" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.soil_name"
							:value="item.props.soil_name"
							table-name="soil" route-name="SoilsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="lu_mgt_name" class="d-inline"></b-form-checkbox>
							Land Use Management Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="lu_mgt_name_pop" />
						</template>
						<b-popover target="lu_mgt_name_pop" triggers="hover focus">
							<reference-label section="Land Use Management" file="landuse.lum" db="landuse_lum" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.lu_mgt_name"
							:value="item.props.lu_mgt_name"
							table-name="lu_mgt" route-name="LanduseEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="soil_plant_init_name" class="d-inline"></b-form-checkbox>
							Soil Plant Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="soil_plant_init_name_pop" />
						</template>
						<b-popover target="soil_plant_init_name_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Soil Plant" file="soil_plant.ini" db="soil_plant_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.soil_plant_init_name"
							:value="item.props.soil_plant_init_name"
							table-name="soil_plant_ini" route-name="InitSoilPlantEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="surf_stor" class="d-inline"></b-form-checkbox>
							Surface Storage Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="surf_stor_pop" />
						</template>
						<b-popover target="surf_stor_pop" triggers="hover focus">
							<reference-label section="Connections / Reservoirs / Wetlands" file="wetlands.wet" db="wetlands_wet" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.surf_stor"
							:value="item.props.surf_stor"
							table-name="wet_res" route-name="ReservoirsWetlandsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="snow_name" class="d-inline"></b-form-checkbox>
							Snow Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="snow_name_pop" />
						</template>
						<b-popover target="snow_name_pop" triggers="hover focus">
							<reference-label section="Databases / Snow" file="snow.sno" db="snow_sno" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.snow_name"
							:value="item.props.snow_name"
							table-name="snow" route-name="SnowEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="field_name" class="d-inline"></b-form-checkbox>
							Field Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="field_name_pop" />
						</template>
						<b-popover target="field_name_pop" triggers="hover focus">
							<reference-label section="Hydrology / Fields" file="field.fld" db="field_fld" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.field_name"
							:value="item.props.field_name"
							table-name="fld" route-name="FieldsEdit"></type-ahead-and-go>
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
	name: 'HrusForm',
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
			redirectRoute: 'HrusEdit',
			propCol: 'hru',
			propFields: [
				'topo_name', 'hyd_name', 'soil_name', 'lu_mgt_name', 'soil_plant_init_name', 'surf_stor', 'snow_name', 'field_name'
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
