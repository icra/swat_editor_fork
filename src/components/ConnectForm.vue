<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<b-row>
			<b-col :md="isUpdate && !isBulkMode ? 7 : 12">
				<b-form-group label="Name" v-if="!isBulkMode">
					<b-form-input type="text" v-model="item.name" required autofocus maxLength="16"  
						v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
				</b-form-group>
				
				<b-form-group>
					<template slot="label">
						<b-form-checkbox v-if="isBulkMode" v-model="selectedVars" value="wst_name" class="d-inline"></b-form-checkbox>
						Weather Station
						<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="wst_name_pop" />
					</template>
					<b-popover target="wst_name_pop" triggers="hover focus">
						<reference-label section="Climate / Weather Stations" file="weather-sta.cli" db="weather_sta_cli" />
					</b-popover>

					<type-ahead-and-go :show-button="isUpdate"
						v-model="item.wst_name"
						:value="item.wst_name"
						table-name="wst" route-name="StationsEdit"></type-ahead-and-go>
				</b-form-group>
				
				<b-row v-if="!isBulkMode">
					<b-col>
						<b-form-group label="Latitude">
							<b-form-input v-model.number="item.lat" type="number" step="any" required />
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Longitude">
							<b-form-input v-model.number="item.lon" type="number" step="any" required />
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col v-if="!isBulkMode">
						<b-form-group label="Area (ha)">
							<b-form-input v-model.number="item.area" type="number" step="any" required />
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group>
							<template slot="label">
								<b-form-checkbox v-if="isBulkMode" v-model="selectedVars" value="elev" class="d-inline"></b-form-checkbox>
								Elevation (m)
							</template>
							<b-form-input v-model.number="item.elev" type="number" step="any" />
						</b-form-group>
					</b-col>
				</b-row>
			</b-col>
			<b-col v-if="isUpdate && !isBulkMode" :md="isUpdate && !isBulkMode ? 5 : 12">
				<div class="mb-3">
					<p class="mb-2">Location</p>
					<map-point :lat="item.lat" :lon="item.lon" height="150px"></map-point>
				</div>

				<div>
					<p class="my-2">Outflow</p>
					<div v-if="outflow.list.length < 1" class="alert alert-primary">
							This object does not have any outflow. 
					</div>
					<div v-else>
						<b-table striped small responsive class="table-grid border-bottom" :items="outflow.list" :fields="outflow.fields" :busy="outflow.loading">
							<template v-slot:table-busy>
								<div class="text-center my-4">
									<font-awesome-icon :icon="['fas', 'spinner']" spin size="2x" />
								</div>
							</template>
							<template v-slot:cell(edit)="data">
								<button type="button" class="plain text-primary" @click="edit(data.item)">
									<font-awesome-icon :icon="['fas', 'edit']" />
								</button>
							</template>
							<template v-slot:cell(delete)="data">
								<button type="button" class="plain text-danger" title="Delete" @click="askDelete(data.item.id, 'outflow')">
									<font-awesome-icon :icon="['fas', 'times']" />
								</button>
							</template>
							<template v-slot:cell(obj_name)="data">
								<div v-if="data.item.obj_name != null">
									<router-link v-if="getObjTypeRoute(data.item) != '#'" :to="getObjTypeRoute(data.item)">{{ data.item.obj_name }}</router-link>
									<div v-else>{{ data.item.obj_name }}</div>
								</div>
							</template>
						</b-table>
					</div>
					<div>
						<b-button type="button" variant="info" @click="add">Add Outflow</b-button>
					</div>
				</div>
			</b-col>
		</b-row>

		

		<b-modal v-model="outflow.form.show" size="lg" :title="outflow.form.update ? 'Update outflow' : 'Add outflow'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="outflow.form.error"></error-alert>
			
			<b-form :validated="outflow.form.validated">
				<b-row>
					<b-col>
						<b-form-group label="Object type">
							<b-form-select v-model="outflow.obj.obj_typ" :options="outflow.obj_typs" required @change="outflow.obj_name = null" />
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Object name">
							<type-ahead-and-go :show-button="outflow.form.update && !noObjTypeRoutes.includes(item.obj_typ)" required
								v-model="outflow.obj_name"
								:value="outflow.obj_name" :btn-cols="2"
								:table-name="objTypeToConTable[outflow.obj.obj_typ]" 
								:route-name="objTypeRouteTable[outflow.obj.obj_typ].name"></type-ahead-and-go>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Hydrograph type">
							<b-form-select v-model="outflow.obj.hyd_typ" :options="outflow.hyd_typs" required />
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Fraction">
							<b-form-input v-model.number="outflow.obj.frac" type="number" step="any" required />
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col cols="6">
						<b-form-group label="Order">
							<b-form-input v-model.number="outflow.obj.order" type="number" step="1" required />
						</b-form-group>
					</b-col>
				</b-row>
			</b-form>
			
			<div slot="modal-footer">
				<save-button type="button" :saving="outflow.form.saving" @click.native="saveOutflow" />
				<b-button type="button" variant="secondary" @click="outflow.form.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="outflow.delete.show" size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="outflow.delete.error"></error-alert>
			
			<p>
				Are you sure you want to delete <strong>{{outflow.delete.name}}</strong>?
				This action is permanent and cannot be undone. 
			</p>
			
			<div slot="modal-footer">
				<save-button type="button" :saving="outflow.delete.saving" @click.native="confirmDelete" text="Delete" />
				<b-button type="button" variant="secondary" @click="outflow.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</project-container>
</template>

<script>
import MapPoint from './MapPoint.vue';

export default {
	name: 'ConnectForm',
	components: { 
		MapPoint 
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
		isBulkMode: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		itemOutflow: {
			type: Array,
			default: () => [{id: 0}]
		},
		outflowConIdField: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			selectedVars: [],
			outflow: {
				loading: false,
				error: null,
				fields: [
					{ key: 'edit', label: '', class: 'min' },
					{ key: 'order' },
					{ key: 'obj_typ', label: 'Type' },
					{ key: 'obj_name', label: 'Name' },
					{ key: 'hyd_typ', label: 'Hydrograph' },
					{ key: 'frac', label: 'Fraction' },
					{ key: 'delete', label: '', class: 'min' }
				],
				delete: {
					show: false,
					id: null,
					name: null,
					error: null,
					saving: false
				},
				form: {
					show: false,
					id: null,
					validated: false,
					error: null,
					saving: false
				},
				obj: {
					order: null,
					obj_typ: 'sdc',
					obj_id: null,
					hyd_typ: null,
					frac: null
				},
				obj_name: null,
				obj_typs: [],
				hyd_typs: [],
				list: this.itemOutflow
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		getCodesDb(type) {
			return this.$http.get(`codes/connect/${type}/${this.appPath}`);
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.getCodesDb('obj_typ');
				this.outflow.obj_typs = response.data;

				const response2 = await this.getCodesDb('hyd_typ');
				this.outflow.hyd_typs = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get outflow codes from database.');
			}
			
			this.page.loading = false;
		},
		add() {
			this.outflow.form.update = false;
			this.outflow.form.id = null;
			this.outflow.obj = {
				order: this.outflow.list.length + 1,
				obj_typ: 'sdc',
				obj_id: undefined,
				hyd_typ: undefined,
				frac: undefined
			};
			this.outflow.obj[this.outflowConIdField] = this.item.id;
			this.outflow.obj_name = undefined;
			this.outflow.form.show = true;
		},
		edit(item) {
			this.outflow.form.update = true;
			this.outflow.form.id = item.id;
			this.outflow.obj = {
				order: item.order,
				obj_typ: item.obj_typ,
				obj_id: item.obj_id,
				hyd_typ: item.hyd_typ,
				frac: item.frac
			};
			this.outflow.obj[this.outflowConIdField] = this.item.id;
			this.outflow.obj_name = item.obj_name;
			this.outflow.form.show = true;
		},
		async saveOutflow() {
			this.outflow.form.error = null;
			this.outflow.form.saving = true;
			this.outflow.form.validated = true;

			if (this.validateOutflow()) {
				try {
					const response = await this.getAutoCompleteId(this.objTypeToConTable[this.outflow.obj.obj_typ], this.outflow.obj_name);
					this.outflow.obj.obj_id = response.data.id;
				} catch (error) {
					this.outflow.form.error = this.logError(error, 'Invalid object name, ' + this.outflow.obj_name + '. Please make sure the ' + this.outflow.obj.obj_typ + ' exists in your database.');
				}

				if (this.isNullOrEmpty(this.outflow.form.error)) {
					var action;
					if (this.outflow.form.update) {
						action = this.$http.put(`${this.apiUrl}/out/${this.outflow.form.id}/${this.projectDbUrl}`, this.outflow.obj);
					} else {
						action = this.$http.post(`${this.apiUrl}/out/post/${this.projectDbUrl}`, this.outflow.obj);
					}

					try {
						const response = await action;
						this.outflow.form.validated = false;
						this.outflow.form.show = false;
						await this.getOutflow();
					} catch (error) {
						this.outflow.form.error = this.logError(error, 'Unable to save outflow to database.');
					}
				}
			} 
			
			this.outflow.form.saving = false;
		},
		validateOutflow () {
			var valid = true;
			valid = valid && !this.isNullOrEmpty(this.outflow.obj.order);
			valid = valid && !this.isNullOrEmpty(this.outflow.obj.obj_typ);
			valid = valid && !this.isNullOrEmpty(this.outflow.obj_name);
			valid = valid && !this.isNullOrEmpty(this.outflow.obj.hyd_typ);
			valid = valid && !this.isNullOrEmpty(this.outflow.obj.frac);
			return valid;
		},
		askDelete(id, name) {
			this.outflow.delete.id = id;
			this.outflow.delete.name = name;
			this.outflow.delete.show = true;
		},
		async confirmDelete() {
			this.outflow.delete.error = undefined;
			this.outflow.delete.saving = true;

			try {
				const response = await this.$http.delete(`${this.apiUrl}/out/${this.outflow.delete.id}/${this.projectDbUrl}`);
				this.outflow.delete.saving = false;
				this.outflow.delete.show = false;
				await this.getOutflow();
			} catch (error) {
				this.outflow.delete.error = this.logError(error, 'Unable to delete from database.');
				this.outflow.delete.saving = false;
			}
		},
		async getOutflow() {
			this.outflow.loading = true;
			this.outflow.error = null;

			try {
				const response = await this.$http.get(`${this.apiUrl}/${this.item.id}/${this.projectDbUrl}`);
				this.outflow.list = response.data.con_outs;
			} catch (error) {
				this.outflow.error = this.logError(error, 'Unable to get object from database.');
			}
				
			this.outflow.loading = false;
		}
	},
	watch: {
		selectedVars() {
			this.$emit('change', this.selectedVars);
		}
	}
}
</script>
