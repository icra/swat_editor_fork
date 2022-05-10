<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<b-form @submit.prevent="save">
			<b-form-group label="Name" :invalid-feedback="requiredFeedback($v.wgn.name)">
				<b-form-input type="text" v-model.trim="$v.wgn.name.$model" required autofocus maxLength="16" 
						:state="getValidState($v.wgn.name)" 
						v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-row>
				<b-col sm>
					<b-form-group label="Latitude" :invalid-feedback="requiredFeedback($v.wgn.lat)">
						<b-form-input v-model.number.trim="$v.wgn.lat.$model" type="number" required step="any" :state="getValidState($v.wgn.lat)"></b-form-input>
					</b-form-group>
				</b-col>
				<b-col sm>
					<b-form-group label="Longitude" :invalid-feedback="requiredFeedback($v.wgn.lon)">
						<b-form-input v-model.number.trim="$v.wgn.lon.$model" type="number" required step="any" :state="getValidState($v.wgn.lon)"></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col sm>
					<b-form-group label="Elevation (m)" :invalid-feedback="requiredFeedback($v.wgn.elev)">
						<b-form-input v-model.number.trim="$v.wgn.elev.$model" type="number" required step="any" :state="getValidState($v.wgn.elev)"></b-form-input>
					</b-form-group>
				</b-col>
				<b-col sm>
					<b-form-group label="Years of recorded max monthly 0.5h rainfall data" :invalid-feedback="requiredFeedback($v.wgn.rain_yrs)">
						<b-form-input v-model.number.trim="$v.wgn.rain_yrs.$model" type="number" required step="any" :state="getValidState($v.wgn.rain_yrs)"></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<div v-if="isUpdate">
				<h2 class="my-3">Monthly Values</h2>
				<div v-if="values.list.length < 1" class="alert alert-primary">
					This weather generator does not have any monthly values. 
					<a href="#" @click.prevent="add">Add now.</a>
				</div>
				<div v-if="values.list.length > 0">
					<b-table striped responsive small table-class="border-bottom table-th-nowrap" :items="values.list" :fields="values.fields" :sort-by.sync="sortBy" :busy="values.loading">
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
							<button type="button" class="plain text-danger" title="Delete" @click="askDelete(data.item.id, 'values for month ' + data.item.month)">
								<font-awesome-icon :icon="['fas', 'times']" />
							</button>
						</template>
					</b-table>
				</div>
			</div>

			<action-bar>
				<save-button :saving="page.saving" />
				<b-button v-if="isUpdate && values.list.length < 12" type="button" variant="info" @click="add" class="mr-1">Add Monthly Values</b-button>
				<back-button />
			</action-bar>
		</b-form>		

		<b-modal v-model="values.form.show" scrollable size="lg" :title="values.form.update ? 'Update monthly values' : 'Add monthly values'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="values.form.error"></error-alert>
			
			<b-form>
				<b-form-group label="Month" :invalid-feedback="requiredFeedback($v.values.obj.month)">
					<b-form-select v-model.trim="$v.values.obj.month.$model" :state="getValidState($v.values.obj.month)"
						:options="values.form.update ? values.months : monthOptions" 
						:disabled="values.form.update ? true : false" />
				</b-form-group>
				
				<b-row>
					<b-col>
						<b-form-group label="Avg max daily temperature (°C)" :invalid-feedback="requiredFeedback($v.values.obj.tmp_max_ave)">
							<b-form-input v-model.number.trim="$v.values.obj.tmp_max_ave.$model" type="number" required step="any" :state="getValidState($v.values.obj.tmp_max_ave)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Avg min daily temperature (°C)" :invalid-feedback="requiredFeedback($v.values.obj.tmp_min_ave)">
							<b-form-input v-model.number.trim="$v.values.obj.tmp_min_ave.$model" type="number" step="any" required :state="getValidState($v.values.obj.tmp_min_ave)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Std deviation for daily max temperature (°C)" :invalid-feedback="requiredFeedback($v.values.obj.tmp_max_sd)">
							<b-form-input v-model.number.trim="$v.values.obj.tmp_max_sd.$model" type="number" step="any" required :state="getValidState($v.values.obj.tmp_max_sd)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Std deviation for daily min temperature (°C)" :invalid-feedback="requiredFeedback($v.values.obj.tmp_min_sd)">
							<b-form-input v-model.number.trim="$v.values.obj.tmp_min_sd.$model" type="number" step="any" required :state="getValidState($v.values.obj.tmp_min_sd)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Avg total monthly precipitation (mm)" :invalid-feedback="requiredFeedback($v.values.obj.pcp_ave)">
							<b-form-input v-model.number.trim="$v.values.obj.pcp_ave.$model" type="number" step="any" required :state="getValidState($v.values.obj.pcp_ave)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Std deviation for avg daily precipitation (mm/day)" :invalid-feedback="requiredFeedback($v.values.obj.pcp_sd)">
							<b-form-input v-model.number.trim="$v.values.obj.pcp_sd.$model" type="number" step="any" required :state="getValidState($v.values.obj.pcp_sd)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Skew coefficient for avg daily precipitation (mm)" :invalid-feedback="requiredFeedback($v.values.obj.pcp_skew)">
							<b-form-input v-model.number.trim="$v.values.obj.pcp_skew.$model" type="number" step="any" required :state="getValidState($v.values.obj.pcp_skew)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Probability of a wet day after a dry day" :invalid-feedback="requiredFeedback($v.values.obj.wet_dry)">
							<b-form-input v-model.number.trim="$v.values.obj.wet_dry.$model" type="number" step="any" required :state="getValidState($v.values.obj.wet_dry)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Probability of a wet day after a wet day" :invalid-feedback="requiredFeedback($v.values.obj.wet_wet)">
							<b-form-input v-model.number.trim="$v.values.obj.wet_wet.$model" type="number" step="any" required :state="getValidState($v.values.obj.wet_wet)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Avg # of precipitation days in month" :invalid-feedback="requiredFeedback($v.values.obj.pcp_days)">
							<b-form-input v-model.number.trim="$v.values.obj.pcp_days.$model" type="number" step="any" required :state="getValidState($v.values.obj.pcp_days)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Max 0.5hr rainfall in entire period (mm)" :invalid-feedback="requiredFeedback($v.values.obj.pcp_hhr)">
							<b-form-input v-model.number.trim="$v.values.obj.pcp_hhr.$model" type="number" step="any" required :state="getValidState($v.values.obj.pcp_hhr)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group :invalid-feedback="requiredFeedback($v.values.obj.slr_ave)">
							<label for="slr_ave">Avg daily solar radiation (MJ/m<sup>2</sup>/day)</label>
							<b-form-input id="slr_ave" v-model.number.trim="$v.values.obj.slr_ave.$model" type="number" step="any" required :state="getValidState($v.values.obj.slr_ave)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="Avg daily dew point temperature (°C)" :invalid-feedback="requiredFeedback($v.values.obj.dew_ave)">
							<b-form-input v-model.number.trim="$v.values.obj.dew_ave.$model" type="number" step="any" required :state="getValidState($v.values.obj.dew_ave)"></b-form-input>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Avg wind speed (m/s)" :invalid-feedback="requiredFeedback($v.values.obj.wnd_ave)">
							<b-form-input v-model.number.trim="$v.values.obj.wnd_ave.$model" type="number" step="any" required :state="getValidState($v.values.obj.wnd_ave)"></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
			</b-form>
			
			<div slot="modal-footer">
				<save-button type="button" :saving="values.form.saving" @click.native="saveValues" />
				<b-button type="button" variant="secondary" @click="values.form.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="values.delete.show" size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="values.delete.error"></error-alert>

			<p>
				Are you sure you want to delete <strong>{{values.delete.name}}</strong>?
				This action is permanent and cannot be undone. 
			</p>
			
			<div slot="modal-footer">
				<save-button type="button" :saving="values.delete.saving" @click.native="confirmDelete" text="Delete" />
				<b-button type="button" variant="secondary" @click="values.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import { required, decimal } from 'vuelidate/lib/validators';

export default {
	name: 'WgnForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		wgn: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			page: {
				error: null,
				saving: false
			},
			sortBy: 'month',
			values: {
				loading: false,
				fields: [
					{ key: 'edit', label: '' },
					{ key: 'month', label: 'Mon', 'class': 'text-right' },
					{ key: 'tmp_max_ave', label: 'Max tmp', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'tmp_min_ave', label: 'Min tmp', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'tmp_max_sd', label: 'Max tmp std', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'tmp_min_sd', label: 'Min tmp std', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'pcp_ave', label: 'Pcp avg', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'pcp_sd', label: 'Pcp std', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'pcp_skew', label: 'Pcp skew', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'wet_dry', label: 'Prob. dry', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'wet_wet', label: 'Prob. wet', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'pcp_days', label: 'Pcp days', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'pcp_hhr', label: 'Max rainfall', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'slr_ave', label: 'Slr', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'dew_ave', label: 'Dew', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'wnd_ave', label: 'Wnd', formatter: (value) => { return this.numberFormat(value, 3) }, 'class': 'text-right' },
					{ key: 'delete', label: '' }
				],
				delete: {
					show: false,
					id: undefined,
					name: '',
					error: undefined,
					saving: false
				},
				form: {
					show: false,
					id: undefined,
					update: false,
					error: undefined,
					saving: false
				},
				list: this.wgn.monthly_values,
				obj: {
					weather_wgn_cli_id: null,
					month: 1,
					tmp_max_ave: null,
					tmp_min_ave: null,
					tmp_max_sd: null,
					tmp_min_sd: null,
					pcp_ave: null,
					pcp_sd: null,
					pcp_skew: null,
					wet_dry: null,
					wet_wet: null,
					pcp_days: null,
					pcp_hhr: null,
					slr_ave: null,
					dew_ave: null,
					wnd_ave: null
				},
				months: [
					{ value: 1, text: '01 - January' },
					{ value: 2, text: '02 - February' },
					{ value: 3, text: '03 - March' },
					{ value: 4, text: '04 - April' },
					{ value: 5, text: '05 - May' },
					{ value: 6, text: '06 - June' },
					{ value: 7, text: '07 - July' },
					{ value: 8, text: '08 - August' },
					{ value: 9, text: '09 - September' },
					{ value: 10, text: '10 - October' },
					{ value: 11, text: '11 - November' },
					{ value: 12, text: '12 - December' }
				]
			}
		}
	},
	validations: {
		wgn: {
			name: { required },
			lat: { required, decimal },
			lon: { required, decimal },
			elev: { required, decimal },
			rain_yrs: { required, decimal }
		},
		values: {
			obj: {
				month: { required },
				tmp_max_ave: { required, decimal },
				tmp_min_ave: { required, decimal },
				tmp_max_sd: { required, decimal },
				tmp_min_sd: { required, decimal },
				pcp_ave: { required, decimal },
				pcp_sd: { required, decimal },
				pcp_skew: { required, decimal },
				wet_dry: { required, decimal },
				wet_wet: { required, decimal },
				pcp_days: { required, decimal },
				pcp_hhr: { required, decimal },
				slr_ave: { required, decimal },
				dew_ave: { required, decimal },
				wnd_ave: { required, decimal }
			}
		}
	},
	computed: {
		monthOptions() {
			if (this.values.list.length < 1) return this.values.months;
			else {
				let usedMonths = [];
				for (let v of this.values.list) {
					usedMonths.push(v.month);
				}

				return this.values.months.filter(function (el) { return !usedMonths.includes(el.value); })
			}
		}
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put(`climate/wgn/${this.wgn.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`climate/wgn/post/${this.projectDbUrl}`, data);
		},
		getDb() {
			return this.$http.get(`climate/wgn/${this.wgn.id}/${this.projectDbUrl}`);
		},
		postValuesDb(data) {
			return this.$http.post(`climate/wgn/months/${this.wgn.id}/${this.projectDbUrl}`, data);
		},
		putValuesDb(id, data) {
			return this.$http.put(`climate/wgn/month/${id}/${this.projectDbUrl}`, data);
		},
		deleteValuesDb(id) {
			return this.$http.delete(`climate/wgn/month/${id}/${this.projectDbUrl}`);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.$v.wgn.$touch();

			if (this.$v.wgn.$invalid) {
				this.page.error = 'Please fix the errors below and try again.';
			} else {
				let data = {
					name: this.validName(this.wgn.name),
					lat: this.wgn.lat,
					lon: this.wgn.lon,
					elev: this.wgn.elev,
					rain_yrs: this.wgn.rain_yrs
				};
				
				try {
					await this.putDb(data);
					
					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'Wgn'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}
			
			this.page.saving = false;
		},
		async getValues() {
			this.values.loading = true;

			try {
				const response = await this.getDb();
				this.values.list = response.data.monthly_values;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get wgn monthly values from database.');
			}	

			this.values.loading = false;
		},
		add() {
			this.values.form.update = false;
			this.values.form.id = null;
			this.values.obj = {
				weather_wgn_cli_id: this.wgn.id,
				month: 1,
				tmp_max_ave: null,
				tmp_min_ave: null,
				tmp_max_sd: null,
				tmp_min_sd: null,
				pcp_ave: null,
				pcp_sd: null,
				pcp_skew: null,
				wet_dry: null,
				wet_wet: null,
				pcp_days: null,
				pcp_hhr: null,
				slr_ave: null,
				dew_ave: null,
				wnd_ave: null				
			};

			if (this.values.list.length > 0 && this.monthOptions.length > 0) {
				this.values.obj.month = this.monthOptions[0].value;
			}

			this.values.form.show = true;
		},
		edit(item) {
			this.values.form.update = true;
			this.values.form.id = item.id;
			this.values.obj = item;
			this.values.form.show = true;
		},		
		async saveValues() {
			this.values.form.error = null;
			this.values.form.saving = true;
			this.$v.values.obj.$touch();

			if (this.$v.values.obj.$invalid) {
				this.values.form.error = 'Please fix the errors below and try again.';
			} else {
				let action;
				if (this.values.form.update) {
					action = this.putValuesDb(this.values.form.id, this.values.obj);
				} else {
					action = this.postValuesDb(this.values.obj);
				}

				try {
					await action;
					this.$v.values.obj.$reset();
					await this.getValues();
					this.values.form.show = false;
				} catch (error) {
					this.values.form.error = this.logError(error, 'Unable to save values to database.');
				}
			} 

			this.values.form.saving = false;
		},
		askDelete(id, name) {
			this.values.delete.id = id;
			this.values.delete.name = name;
			this.values.delete.show = true;
		},
		async confirmDelete() {
			this.values.delete.error = null;
			this.values.delete.saving = true;

			try {
				await this.deleteValuesDb(this.values.delete.id);
				await this.getValues();
				this.values.delete.show = false;
			} catch (error) {
				this.values.delete.error = this.logError(error, 'Unable to delete from database.');
			}

			this.values.delete.saving = false;
		}
	}
}
</script>