<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form @submit.prevent="save">
			<b-form-group label="Name" :invalid-feedback="requiredFeedback($v.item.name)">
				<b-form-input type="text" v-model.trim="$v.item.name.$model" required autofocus maxLength="16" 
						:state="getValidState($v.item.name)" 
						v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-form-group label="Initial Rotation Year">
				<b-form-input type="number" v-model="item.rot_yr_ini" required />
				<div class="invalid-feedback">Required</div>
			</b-form-group>

			<b-form-group label="Description (optional)">
				<b-form-input type="text" v-model.trim="$v.item.description.$model" :state="getValidState($v.item.description)" />
			</b-form-group>

			<div v-if="isUpdate">
				<h2 class="my-3">Plants</h2>
				<div v-if="plants.list.length < 1" class="alert alert-primary">
					This community does not have any plants. 
					<a href="#" @click.prevent="add">Add now.</a>
				</div>
				<div v-else>
					<b-table striped responsive small table-class="border-bottom table-th-nowrap" :items="plants.list" :fields="plants.fields" :sort-by.sync="plants.sortBy" :busy="plants.loading">
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
							<button type="button" class="plain text-danger" title="Delete" @click="askDelete(data.item.id, 'plant ' + data.item.plnt_name_name)">
								<font-awesome-icon :icon="['fas', 'times']" />
							</button>
						</template>
						<template v-for="(field, i) in plants.routerLinkFields" v-slot:[cellKey(field.key)]="data">
							<div :key="i" v-if="data.item[field.key] != null">
								<router-link :key="i" v-if="field.route != undefined && field.route != '#'" :to="field.route + data.item[field.key].id">{{ data.item[field.key].name }}</router-link>
								<div v-else>{{ data.item[field.key].name }}</div>
							</div>
						</template>
					</b-table>
				</div>
			</div>

			<action-bar>
				<save-button :saving="page.saving" />
				<b-button v-if="isUpdate" type="button" variant="info" @click="add" class="mr-1">Add Plant to Community</b-button>
				<back-button />
			</action-bar>
		</b-form>

		<b-modal v-model="plants.form.show" scrollable size="lg" :title="(plants.form.update ? 'Update' : 'Add') + ' Plant'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="plants.form.error"></error-alert>
			
			<b-form :validated="plants.form.validated">
				<b-form-group>
					<template slot="label">
						Plant
						<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="plnt_name_pop" />
					</template>
					<b-popover target="plnt_name_pop" triggers="hover focus">
						<reference-label section="Databases / Plants" file="plants.plt" db="plants_plt" api-url="db/plants" />
					</b-popover>

					<type-ahead-and-go :show-button="plants.form.update"
						v-model="plants.plnt_name"
						:value="plants.plnt_name"
						table-name="plant" route-name="PlantsEdit"></type-ahead-and-go>
				</b-form-group>

				<table class="table edit">
					<thead class="thead-light">
						<tr>
							<th colspan="2">Value</th>
							<th>Description</th>
							<th>SWAT+ Variable</th>
							<th>Default</th>
							<th>Recommended Range</th>
						</tr>
					</thead>
					<tbody>
						<tr-var-editor v-for="(v, i) in vars" :key="i"
							:id="'item_' + v.name" required show_range
							v-model="plants.obj[v.name]" :value="plants.obj[v.name]"
							:var_def="v" />
					</tbody>
				</table>
			</b-form>

			<div slot="modal-footer">
				<save-button type="button" :saving="plants.form.saving" @click.native="savePlant" />
				<b-button type="button" variant="secondary" @click="plants.form.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="plants.delete.show" size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="plants.delete.error"></error-alert>
			
			<p>
				Are you sure you want to delete <strong>{{plants.delete.name}}</strong>?
				This action is permanent and cannot be undone. 
			</p>
			
			<div slot="modal-footer">
				<save-button type="button" :saving="plants.delete.saving" @click.native="confirmDelete" text="Delete" />
				<b-button type="button" variant="secondary" @click="plants.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import TrVarEditor from '@/components/TrVarEditor';
import { required, integer } from 'vuelidate/lib/validators';

export default {
	name: 'InitPlantForm',
	components: {
		TrVarEditor
	},
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		vars: {
			required: false
        }
	},
	data() {
		return {
			page: {
				error: null,
				saving: false
            },
			plants: {
				loading: false,
				sortBy: 'plnt_name',
				fields: [
					{ key: 'edit', label: '', class: 'min' },
					{ key: 'plnt_name', label: 'Plant', sortable: true },
					{ key: 'lc_status', label: 'Land Cover', sortable: true, class: 'text-right', formatter: (value) => { return value ? 'Yes' : 'No' } },
					{ key: 'lai_init', label: 'Init. LAI', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'bm_init', label: 'Init. Biomass', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'phu_init', label: 'Init. PHU Frac.', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'plnt_pop', label: 'Plant Pop.', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'yrs_init', label: 'Age (yrs)', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'rsd_init', label: 'Init. Residue Cover', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(3) } },
					{ key: 'delete', label: '' }
				],
				routerLinkFields: [
					{ key: 'plnt_name', route: '/edit/db/plants/edit/' }
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
					validated: false,
					error: undefined,
					saving: false
				},
				list: this.item.plants,
				obj: {
					plant_ini_id: this.item.id,
					plnt_name_id: null,
					lc_status: null,
					lai_init: null,
					bm_init: null,
					phu_init: null,
					plnt_pop: null,
					yrs_init: null,
					rsd_init: null
				},
				plnt_name: null
			}
		}
	},
	validations: {
		item: {
			name: { required },
			rot_yr_ini: { required, integer },
			description: {}
		}
	},
	created() {
		if (this.currentProjectSupported) this.get();
	},
	methods: {
		cellKey(key) {
			return `cell(${key})`;
		},
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put('plant_ini/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('plant_ini/post/' + this.projectDbUrl, data);
		},
		getDb() {
			return this.$http.get('plant_ini/' + this.item.id + '/' + this.projectDbUrl);
		},
		postPlantDb(data) {
			return this.$http.post('plant_ini/item/post/' + this.projectDbUrl, data);
		},
		putPlantDb(id, data) {
			return this.$http.put('plant_ini/item/' + id + '/' + this.projectDbUrl, data);
		},
		deletePlantDb(id) {
			return this.$http.delete('plant_ini/item/' + id + '/' + this.projectDbUrl);
		},
		async getPlants() {
			this.plants.loading = true;

			try {
				const response = await this.getDb();
				this.plants.list = response.data.plants;
				this.setPlantNames();
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get plants from database.');
			}

			this.plants.loading = false;
		},
		setPlantNames: function() {
			if (this.isUpdate) {
				for (var i = 0; i < this.plants.list.length; i++) {
					var p = this.plants.list[i].plnt_name;
					this.plants.list[i].plnt_name_name = p == null ? null : p.name;
				}
			}
		},
		get() {
			this.setPlantNames();
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.$v.item.$touch();

			if (this.$v.item.$invalid) {
				this.page.error = 'Please fix the errors below and try again.';
			} else {
				let data = {
					name: this.validName(this.item.name),
					rot_yr_ini: this.item.rot_yr_ini,
					description: this.item.description
				};

				if (this.isUpdate) {
					data.id = this.item.id;
				}
				
				try {
					const response = await this.putDb(data);
					
					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'InitPlantEdit', params: { id: response.data.id }});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}
			
			this.page.saving = false;
		},
		add() {
			this.plants.form.validated=false;			
			this.plants.form.update = false;
			this.plants.form.id = null;
			this.plants.obj = {
				plant_ini_id: this.item.id,
				plnt_name_id: null,
				lc_status: null,
				lai_init: null,
				bm_init: null,
				phu_init: null,
				plnt_pop: null,
				yrs_init: null,
				rsd_init: null				
			};
			this.plants.plnt_name = null;
			this.plants.form.show = true;
		},
		edit(item) {
			this.plants.form.update = true;
			this.plants.form.id = item.id;
			this.plants.obj = {
				id: item.id,
				plant_ini_id: this.item.id,
				plnt_name_id: item.plnt_name_id,
				lc_status: item.lc_status,
				lai_init: item.lai_init,
				bm_init: item.bm_init,
				phu_init: item.phu_init,
				plnt_pop: item.plnt_pop,
				yrs_init: item.yrs_init,
				rsd_init: item.rsd_init				
			};
			this.plants.plnt_name = item.plnt_name_name;
			this.plants.form.show = true;
		},
		askDelete(id, name) {
			this.plants.delete.id = id;
			this.plants.delete.name = name;
			this.plants.delete.show = true;
		},
		async confirmDelete() {
			this.plants.delete.error = null;
			this.plants.delete.saving = true;

			try {
				await this.deletePlantDb(this.plants.delete.id);
				await this.getPlants();
				this.plants.delete.show = false;
			} catch (error) {
				this.plants.delete.error = this.logError(error, 'Unable to delete from database.');
			}

			this.plants.delete.saving = false;
		},
		async savePlant() {
			this.plants.form.error = null;
			this.plants.form.saving = true;
			this.plants.form.validated = true;

			if (this.validatePlant()) {
				try {
					const response = await this.getAutoCompleteId('plant', this.plants.plnt_name);
					this.plants.obj.plnt_name_id = response.data.id;
				} catch (error) {
					this.plants.form.error = this.logError(error, 'Invalid plant name, ' + this.plants.plnt_name + '. Please make sure it exists in your database.');
				}

				if (this.plants.form.error == undefined) {
					var action;
					if (this.plants.form.update) {
						action = this.putPlantDb(this.plants.form.id, this.plants.obj);
					} else {
						action = this.postPlantDb(this.plants.obj);
					}

					try {
						await action;
						await this.getPlants();
						this.plants.form.validated = false;
						this.plants.form.show = false;
					} catch (error) {
						this.plants.form.error = this.logError(error, 'Unable to save plant to database.');
					}
				}
			} 
			
			this.plants.form.saving = false;
		},
		validatePlant() {
			var valid = true;
			valid = valid && !this.isNullOrEmpty(this.plants.plnt_name);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.lc_status);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.lai_init);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.bm_init);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.phu_init);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.plnt_pop);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.yrs_init);
			valid = valid && !this.isNullOrEmpty(this.plants.obj.rsd_init);
			return true;
		}
	}
}
</script>