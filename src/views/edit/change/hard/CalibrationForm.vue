<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<b-form :validated="page.validated" @submit.prevent="save">
			<b-form-group>
				<template slot="label">
					Calibration Parameter
					<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="cal_parm_name_pop" />
				</template>
				<b-popover target="cal_parm_name_pop" triggers="hover focus">
					<reference-label section="Change / Calibration Parameters" file="cal_parms.cal" db="cal_parms_cal" />
				</b-popover>

				<type-ahead-and-go :show-button="isUpdate"
					v-model="item.cal_parm_name"
					:value="item.cal_parm_name"
					table-name="cal_parms" route-name="HardCalibrationParmsEdit"></type-ahead-and-go>
			</b-form-group>

			<b-row>
				<b-col>
					<b-form-group label="Type of Change">
						<b-form-select v-model="item.chg_typ" :options="chgTypeOptions" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Value of Change">
						<b-form-input required v-model.number="item.chg_val" type="number" step="any" />
					</b-form-group>
				</b-col>
			</b-row>

			<b-row v-if="parmTypes.sol.includes(item.cal_parm_name)">
				<b-col>
					<b-form-group label="First Soil Layer to Apply Change">
						<b-form-input required v-model.number="item.soil_lyr1" type="number" step="any" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Last Soil Layer to Apply Change">
						<b-form-input required v-model.number="item.soil_lyr2" type="number" step="any" />
					</b-form-group>
				</b-col>
			</b-row>

			<b-row v-if="parmTypes.cli.includes(item.cal_parm_name)">
				<b-col>
					<b-form-group label="First Year to Apply Change">
						<b-form-input required v-model.number="item.yr1" type="number" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Last Year to Apply Change">
						<b-form-input required v-model.number="item.yr2" type="number" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="First Day to Apply Change">
						<b-form-input required v-model.number="item.day1" type="number" min="1" max="366" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Last Day to Apply Change">
						<b-form-input required v-model.number="item.day2" type="number" min="1" max="366" />
					</b-form-group>
				</b-col>
			</b-row>

			<b-row v-if="isUpdate" class="mt-3">
				<b-col v-if="objOptions.length > 0">
					<b-form-group label="Select Objects to Calibrate">
						<div class="form-text text-muted mb-1">All will be calibrated if none are selected.</div>
						<div class="restricted-height-box">
							<b-form-checkbox-group stacked v-model="calObjects" :options="objOptions" />
						</div>
					</b-form-group>
				</b-col>
				<b-col>
					<div>Calibration Conditions</div>
					<div v-if="conditions.length < 1" class="alert alert-primary my-3">
						This calibration does not have any conditions. 
						<a href="#" @click.prevent="addCond">Add now.</a>
					</div>
					<div v-if="conditions.length > 0" class="my-3">				
						<table class="table border-bottom table-grid table-striped table-sm">
							<thead>
								<tr>
									<th></th>
									<th>Type</th>
									<th>Operator</th>
									<th>Value</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="cond in conditions" :key="cond.calibration_cal_id">
									<td><font-awesome-icon :icon="['fas', 'edit']" class="text-primary pointer" @click="editCond(cond)" v-b-tooltip.hover.right="'Edit'" /></td>
									<td>{{cond.cond_typ}}</td>
									<td>{{cond.cond_op}}</td>
									<td>{{cond.cond_val == null ? cond.cond_val_text : cond.cond_val}}</td>
									<td><font-awesome-icon :icon="['fas', 'times']" class="text-danger pointer" @click="removeCond(cond)" v-b-tooltip.hover.right="'Delete'" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</b-col>
			</b-row>

			<div class="mt-3" v-if="!isUpdate">
				You will be able to set conditions and objects to which to apply the calibration after clicking save changes below.
			</div>

			<action-bar>
				<save-button :saving="page.saving" @click.native="page.validated = true" />
				<b-btn v-if="isUpdate" variant="info" @click="addCond" class="mr-1">Add Condition</b-btn>
				<back-button />
			</action-bar>
		</b-form>		

		<b-modal ref="condModal" v-model="modal.show" size="lg" :title="(modal.new ? 'Add' : 'Edit') + ' Condition'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<b-alert variant="danger" :show="modal.error !== undefined">
				{{modal.error}}
			</b-alert>

			<b-form>
				<b-form-group label="Type of Condition">
					<b-form-select v-model="modal.condition.cond_typ" :options="conditionTypeOptions" />
				</b-form-group>

				<b-form-group label="Condition Operator">
					<b-form-select v-model="modal.condition.cond_op" :options="conditionOperatorOptions" />
				</b-form-group>

				<b-form-group label="Value">
					<b-form-input v-if="modal.condition.cond_typ == 'region'" v-model.number="modal.condition.cond_val" type="number" step="any" />
					<b-form-input v-else type="text" v-model="modal.condition.cond_val_text" />
				</b-form-group>
			</b-form>

			<div slot="modal-footer">
				<save-button :saving="modal.saving" @click.native="saveCond" />
				<b-button type="button" variant="secondary" @click="cancel">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
export default {
	name: 'CalibrationForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		objOptions: {
			type: Array,
			required: true
		},
		initObjs: {
			type: Array,
			required: false,
			default: () => []
		},
		initConds: {
			type: Array,
			required: false,
			default: () => []
		}
	},
	data() {
		return {
			page: {
				loading: true,
				error: undefined,
				validated: false,
				saving: false
			},
			chgTypeOptions: [
				{ value: 'absval', text: 'Change the value of the parameter (absval)' },
				{ value: 'abschg', text: 'Change the value by the specified amount (abschg)' },
				{ value: 'pctchg', text: 'Change the value by the specified percent (pctchg)' }
			],
			conditionTypeOptions: [
				{ value: 'hsg', text: 'Hydrologic soil group' },
				{ value: 'texture', text: 'Texture' },
				{ value: 'landuse', text: 'Land use' },
				{ value: 'region', text: 'Region' }
			],
			conditionOperatorOptions: [
				{ value: '=', text: '=' },
				{ value: '>', text: '>' },
				{ value: '<', text: '<' }
			],
			parmTypes: {
				sol: [],
				cli: []
			},
			calObjects: this.initObjs,
			conditions: this.initConds,
			modal: {
				show: false,
				validate: false,
				saving: false,
				error: undefined,

				new: false,
				editIndex: 0,
				condition: {
					calibration_cal_id: this.item.id,
					cond_typ: 'landuse',
					cond_op: '=',
					cond_val: null,
					cond_val_text: null
				}
			}
		}
	},
	async mounted() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put('change/calibration/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('change/calibration/post/' + this.projectDbUrl, data);
		},
		getCalParmTypes() {
			return this.$http.get('change/cal_parms/types/' + this.projectDbUrl);
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

			try {
				const response = await this.getCalParmTypes();
				this.parmTypes = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to load calibration parameters from database.');
			}

			this.page.loading = false;
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;

			let cal_parm_id = 0;			
			try {
				const response = await this.getAutoCompleteId('cal_parms', this.item.cal_parm_name);
				cal_parm_id = response.data.id;
			} catch (error) {
				this.page.error = this.logError(error, 'Invalid parameter name, ' + this.item.cal_parm_name + '. Please make sure the calibration parameter exists in your database.');
			}

			if (this.isNullOrEmpty(this.page.error)) {
				let is_sol = this.parmTypes.sol.includes(this.item.cal_parm_name);
				let is_cli = this.parmTypes.cli.includes(this.item.cal_parm_name);
				let item = {
					cal_parm_id: cal_parm_id,
					chg_typ: this.item.chg_typ,
					chg_val: this.item.chg_val,
					soil_lyr1: is_sol ? this.item.soil_lyr1 : 0,
					soil_lyr2: is_sol ? this.item.soil_lyr2 : 0,
					yr1: is_cli ? this.item.yr1 : 0,
					yr2: is_cli ? this.item.yr2 : 0,
					day1: is_cli ? this.item.day1 : 0,
					day2: is_cli ? this.item.day2 : 0
				};

				if (this.isUpdate) {
					item.id = this.item.id;
					item.elements = this.calObjects;
					item.conditions = this.conditions;
				}

				try {
					const response = await this.putDb(item);
					this.page.validated = false;

					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'HardCalibrationEdit', params: { id: response.data.id }});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}

			this.page.saving = false;
		},
		addCond() {
			this.modal.condition = {
				calibration_cal_id: this.item.id,
				cond_typ: 'landuse',
				cond_op: '=',
				cond_val: null,
				cond_val_text: null
			}
			this.modal.editIndex = 0;
			this.modal.new = true;
			this.modal.show = true;
		},
		editCond(cond) {
			this.modal.condition = {
				calibration_cal_id: this.item.id,
				cond_typ: cond.cond_typ,
				cond_op: cond.cond_op,
				cond_val: cond.cond_val,
				cond_val_text: cond.cond_val_text
			}
			this.modal.editIndex = this.conditions.indexOf(cond);
			this.modal.new = false;
			this.modal.show = true;
		},
		removeCond(cond) {
			this.conditions.splice(this.conditions.indexOf(cond), 1);
		},
		saveCond() {
			if (this.modal.condition.cond_typ != 'region') {
				this.modal.condition.cond_val = null;
			} else {
				this.modal.condition.cond_val_text = null;
			}

			if (this.modal.new) {
				this.conditions.push(this.modal.condition);
			} else {
				this.conditions[this.modal.editIndex] = this.modal.condition;
			}

			this.modal.show = false;
		},
		cancel() {
			this.modal.show = false;
		}
	}
}
</script>