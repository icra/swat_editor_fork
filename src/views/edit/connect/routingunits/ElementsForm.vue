<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<b-form-group label="Name">
				<b-form-input type="text" v-model="item.name" required autofocus maxLength="16" 
					v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							Assign to Routing Unit
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="rtu_pop" />
						</template>
						<b-popover target="rtu_pop" triggers="hover focus">
							<reference-label section="Routing Units" file="rout_unit.con" db="rout_unit_con" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate" required
							v-model="item.rtu_name"
							:value="item.rtu_name"
							table-name="rtu" route-name="RoutingUnitEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							Delivery Ratio
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="dlr_pop" />
						</template>
						<b-popover target="dlr_pop" triggers="hover focus">
							<reference-label section="Delivery Ratio" file="delratio.del" db="delratio_del" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate" 
							v-model="item.dlr_name"
							:value="item.dlr_name"
							table-name="dlr" route-name="DelratioEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group label="Object Type">
						<b-form-select v-model="item.obj_typ" :options="objTypes" required @change="item.obj_name = null" />
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group :label="capitalizeFirstLetter(item.obj_typ) + ' object name'">
						<type-ahead-and-go :show-button="isUpdate && !noObjTypeRoutes.includes(item.obj_typ)" required
							v-model="item.obj_name"
							:value="item.obj_name"
							:table-name="objTypeToConTable[item.obj_typ]" 
							:route-name="objTypeRouteTable[item.obj_typ].name"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md="6">
					<b-form-group label="Fraction">
						<b-form-input v-model.number="item.frac" type="number" step="any" class="form-control" required min="0" max="1" />
						<div class="invalid-feedback">Required and must be between 0 and 1</div>
					</b-form-group>
				</b-col>
			</b-row>

			<action-bar>
				<save-button :saving="page.saving" />
				<back-button />
			</action-bar>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'ElementsForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		objTypes: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			page: {
				error: null,
				validated: false,
				saving: false
            }
		}
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put(`routing_unit/elements/${this.item.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`routing_unit/elements/post/${this.projectDbUrl}`, data);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;

			try {
				const response = await this.getAutoCompleteId(this.objTypeToConTable[this.item.obj_typ], this.item.obj_name);
				this.item.obj_id = response.data.id;
			} catch (error) {
				this.page.error = this.logError(error, 'Invalid object name, ' + this.item.obj_name + '. Please make sure the ' + this.item.obj_typ + ' exists in your database.');
			}

			try {
				const response = await this.getAutoCompleteId('rtu', this.item.rtu_name);
				this.item.rtu_id = response.data.id;
			} catch (error) {
				this.page.error = this.logError(error, 'Invalid routing unit name, ' + this.item.rtu_name + '. Please make sure it exists in your database.');
			}

			if (!this.isNullOrEmpty(this.item.dlr_name)) {
				try {
					const response = await this.getAutoCompleteId('dlr', this.item.dlr_name);
					this.item.dlr_id = response.data.id;
				} catch (error) {
					this.page.error = this.logError(error, 'Invalid delivery ratio name, ' + this.item.dlr_name + '. Please make sure it exists in your database.');
				}
			}

			if (this.isNullOrEmpty(this.page.error)) {
				let item = {
					name: this.validName(this.item.name),
					obj_typ: this.item.obj_typ,
					obj_id: this.item.obj_id,
					rtu_id: this.item.rtu_id,
					dlr_id: this.item.dlr_id,
					frac: this.item.frac
				};

				if (this.isUpdate) {
					item.id = this.item.id;
				}
				
				try {
					const response = await this.putDb(item);
					this.page.validated = false;

					if (this.isUpdate || this.updateMany)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'RoutingUnitElements'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}

			this.page.saving = false;
		}
	}
}
</script>