<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<b-row>
				<b-col>
					<b-form-group label="Name">
						<b-form-input type="text" v-model="item.name" required autofocus maxLength="16" 
							v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							Assign to Landscape Unit
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="ls_unit_def_pop" />
						</template>
						<b-popover target="ls_unit_def_pop" triggers="hover focus">
							<reference-label section="Landscape Units" file="ls_unit.def" db="ls_unit_def" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate" required
							v-model="item.ls_unit_def_name"
							:value="item.ls_unit_def_name"
							table-name="ls_unit_def" route-name="LandscapeUnitsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label="Object Type">
						<b-form-select v-model="item.obj_typ" :options="objTypes" required @change="item.obj_name = null" />
					</b-form-group>
				</b-col>
				<b-col>
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
				<b-col>
					<b-form-group label="Basin Fraction">
						<b-form-input v-model.number="item.bsn_frac" type="number" step="any" class="form-control" required min="0" max="1" />
						<div class="invalid-feedback">Required and must be between 0 and 1</div>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Subbasin Fraction">
						<b-form-input v-model.number="item.sub_frac" type="number" step="any" class="form-control" required min="0" max="1" />
						<div class="invalid-feedback">Required and must be between 0 and 1</div>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Region Fraction">
						<b-form-input v-model.number="item.reg_frac" type="number" step="any" class="form-control" required min="0" max="1" />
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
				return this.$http.put(`ls_units/elements/${this.item.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`ls_units/elements/post/${this.projectDbUrl}`, data);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;

			try {
				const response = await this.getAutoCompleteId(this.objTypeToConTable[this.item.obj_typ], this.item.obj_name);
				this.item.obj_typ_no = response.data.id;
			} catch (error) {
				this.page.error = this.logError(error, 'Invalid object name, ' + this.item.obj_name + '. Please make sure the ' + this.item.obj_typ + ' exists in your database.');
			}

			if (this.isNullOrEmpty(this.page.error)) {
				try {
					const response = await this.getAutoCompleteId('ls_unit_def', this.item.ls_unit_def_name);
					this.item.ls_unit_def_id = response.data.id;
				} catch (error) {
					this.page.error = this.logError(error, 'Invalid landscape unit name, ' + this.item.ls_unit_def_name + '. Please make sure it exists in your database.');
				}
			}

			if (this.isNullOrEmpty(this.page.error)) {
				let item = {
					name: this.validName(this.item.name),
					obj_typ: this.item.obj_typ,
					obj_typ_no: this.item.obj_typ_no,
					ls_unit_def_id: this.item.ls_unit_def_id,
					bsn_frac: this.item.bsn_frac,
					sub_frac: this.item.sub_frac,
					reg_frac: this.item.reg_frac
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
						this.$router.push({ name: 'LandscapeUnitsElements'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}

			this.page.saving = false;
		}
	}
}
</script>