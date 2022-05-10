<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="page.bulk.show">
				<object-selector name="Channels" table="chandeg_con" @change="bulkSelectionChange"></object-selector>
			</div>
			
			<connect-form
				:item="item.connect" :item-outflow="item.outflow" :api-url="apiUrl" outflow-con-id-field="chandeg_con_id"
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
							<reference-label section="Channels / Initial" file="initial.cha" db="initial_cha" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.init_name"
							:value="item.props.init_name"
							table-name="init_cha" route-name="ChannelsInitialEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hyd_name" class="d-inline"></b-form-checkbox>
							Hydrology/Sediment Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hydsed_pop" />
						</template>
						<b-popover target="hydsed_pop" triggers="hover focus">
							<reference-label section="Channels / Hydrology &amp; Sediment" file="hyd-sed-lte.cha" db="hyd_sed_lte_cha" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.hyd_name"
							:value="item.props.hyd_name"
							table-name="hyd_sed_lte_cha" route-name="ChannelsHydSedLteEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col md="6">
					<b-form-group label-for="nut_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="nut_name" class="d-inline"></b-form-checkbox>
							Nutrients Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="nut_pop" />
						</template>
						<b-popover target="nut_pop" triggers="hover focus">
							<reference-label section="Channels / Nutrients" file="nutrients.cha" db="nutrients_cha" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.props.nut_name"
							:value="item.props.nut_name"
							table-name="nut_cha" route-name="ChannelsNutrientsEdit"></type-ahead-and-go>
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
	name: 'ChannelsForm',
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
			if (this.item.props.init_name === '') this.item.props.init_name = null;
			if (this.item.props.hyd_name === '') this.item.props.hyd_name = null;
			if (this.item.props.nut_name === '') this.item.props.nut_name = null;

			if (!this.page.bulk.show) {
				let name = this.validName(this.item.connect.name);
				this.item.props.name = name;
				this.item.connect.name = name;

				if (this.isUpdate)
					this.item.connect.lcha_id = this.item.props.id;

				try {
					const response = await this.putPropsDb(this.item.props);
					if (!this.isUpdate)
						this.item.connect.lcha_id = response.data.id;
						
					const response2 = await this.putConnectDb(this.item.connect);
					this.page.validated = false;
					
					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'ChannelsEdit', params: { id: response2.data.id } });
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
