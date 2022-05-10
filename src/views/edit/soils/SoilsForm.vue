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

			<b-form-group label="Texture (optional)">
				<b-form-input type="text" v-model.trim="$v.item.texture.$model" :state="getValidState($v.item.texture)" />
			</b-form-group>

			<b-form-group label="Description (optional)" label-for="description">
				<b-form-input id="description" type="text" v-model.trim="$v.item.description.$model" :state="getValidState($v.item.description)" />
			</b-form-group>

			<b-row>
				<b-col>
					<b-form-group label="Hydrologic group">
						<b-form-select v-model.trim="$v.item.hyd_grp.$model" :options="hydGrpOptions" :state="getValidState($v.item.hyd_grp)" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Maximum rooting depth of soil profile (mm)" :invalid-feedback="requiredFeedback($v.item.dp_tot)">
						<b-form-input v-model.number.trim="$v.item.dp_tot.$model" type="number" step="any" required :state="getValidState($v.item.dp_tot)" />
					</b-form-group>
				</b-col>
			</b-row>
			
			<b-row>
				<b-col>
					<b-form-group label="Fraction of porosity (void space) from which anions are excluded" :invalid-feedback="requiredFeedback($v.item.anion_excl)">
						<b-form-input v-model.number.trim="$v.item.anion_excl.$model" type="number" step="any" required :state="getValidState($v.item.anion_excl)" />
					</b-form-group>
				</b-col>
			</b-row><b-row>
				<b-col>
					<b-form-group label="Potential or maximum crack volume of the soil profile expressed as a fraction of the total soil volume" :invalid-feedback="requiredFeedback($v.item.perc_crk)">
						<b-form-input v-model.number.trim="$v.item.perc_crk.$model" type="number" step="any" required :state="getValidState($v.item.perc_crk)" />
					</b-form-group>
				</b-col>
			</b-row>

			<div v-if="isUpdate">
				<h2 class="my-3">Soil Layers</h2>
				<div v-if="layers.list.length < 1" class="alert alert-primary">
					This soil does not have any layers. 
					<a href="#" @click.prevent="add">Add now.</a>
				</div>
				<div v-if="layers.list.length > 0">
					<b-table striped responsive small table-class="border-bottom table-th-nowrap" :items="layers.list" :fields="layers.fields" :sort-by.sync="layers.sortBy" :busy="layers.loading">
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
							<button type="button" class="plain text-danger" title="Delete" @click="askDelete(data.item.id, 'soil layer ' + data.item.layer_num)">
								<font-awesome-icon :icon="['fas', 'times']" />
							</button>
						</template>
					</b-table>
				</div>
			</div>

			<action-bar>
				<save-button :saving="page.saving" />
				<b-button v-if="isUpdate" type="button" variant="info" @click="add" class="mr-1">Add Soil Layer</b-button>
				<back-button />
			</action-bar>
		</b-form>

		<b-modal v-model="layers.form.show" scrollable size="lg" :title="(layers.form.update ? 'Update' : 'Add') + ' Soil Layer'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="layers.form.error"></error-alert>
			
			<b-form :validated="layers.form.validated">
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
							v-model="layers.obj[v.name]" :value="layers.obj[v.name]"
							:var_def="v" />
					</tbody>
				</table>
			</b-form>

			<div slot="modal-footer">
				<save-button type="button" :saving="layers.form.saving" @click.native="saveLayer" />
				<b-button type="button" variant="secondary" @click="layers.form.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="layers.delete.show" size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="layers.delete.error"></error-alert>

			<p>
				Are you sure you want to delete <strong>{{layers.delete.name}}</strong>?
				This action is permanent and cannot be undone. 
			</p>			
			
			<div slot="modal-footer">
				<save-button type="button" :saving="layers.delete.saving" @click.native="confirmDelete" text="Delete" />
				<b-button type="button" variant="secondary" @click="layers.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import TrVarEditor from '@/components/TrVarEditor';
import { required, decimal } from 'vuelidate/lib/validators';

export default {
	name: 'SoilsForm',
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
			hydGrpOptions: [
				{ value: 'A', text: 'A' },
				{ value: 'B', text: 'B' },
				{ value: 'C', text: 'C' },
				{ value: 'D', text: 'D' }
			],
			layers: {
				loading: false,
				sortBy: 'layer_num',
				fields: [],
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
				list: this.item.layers,
				obj: {
					soil_id: this.item.id,
					layer_num: null,
					dp: null,
					bd: null,
					awc: null,
					soil_k: null,
					carbon: null,
					clay: null,
					silt: null,
					sand: null,
					rock: null,
					alb: null,
					usle_k: null,
					ec: null,
					caco3: null,
					ph: null
				}
			}
		}
	},
	validations: {
		item: {
			name: { required },
			hyd_grp: { required },
			dp_tot: { required, decimal },
			anion_excl: { required, decimal },
			perc_crk: { required, decimal },
			texture: {},
			description: {}
		}
	},
	created() {
		if (this.currentProjectSupported) this.get();
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put('soils/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('soils/post/' + this.projectDbUrl, data);
		},
		getDb() {
			return this.$http.get('soils/' + this.item.id + '/' + this.projectDbUrl);
		},
		postLayerDb(data) {
			return this.$http.post('soils/layer/post/' + this.projectDbUrl, data);
		},
		putLayerDb(id, data) {
			return this.$http.put('soils/layer/' + id + '/' + this.projectDbUrl, data);
		},
		deleteLayerDb(id) {
			return this.$http.delete('soils/layer/' + id + '/' + this.projectDbUrl);
		},
		async getLayers() {
			this.layers.loading = true;

			try {
				const response = await this.getDb();
				this.layers.list = response.data.layers;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get soil layers from database.');
			}

			this.layers.loading = false;
		},
		get() {
			if (this.isUpdate && this.item.layers.length > 0) {
				this.getTableFields();
			}
		},
		getTableFields() {
			this.layers.fields = [];
			let keys = Object.keys(this.item.layers[0]);

			for (let i = 0; i < keys.length; i++) {
				if (keys[i] != 'id') {
					let meta = this.getMeta(keys[i], this.item.layers[0][keys[i]]);
					this.layers.fields.push({ key: keys[i], label: meta.label, sortable: true, 'class': meta.css, formatter: meta.formatter });
				}
			}

			this.layers.fields.unshift({ key: 'edit', label: '', class: 'min' });
			this.layers.fields.push({ key: 'delete', label: '' });
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
					description: this.item.description,
					texture: this.item.texture,
					hyd_grp: this.item.hyd_grp,
					dp_tot: this.item.dp_tot,
					anion_excl: this.item.anion_excl,
					perc_crk: this.item.perc_crk
				};

				if (this.isUpdate) {
					data.id = this.item.id;
				}
				
				try {
					await this.putDb(data);
					
					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'Soils'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}
			
			this.page.saving = false;
		},
		add() {
			this.layers.form.validated = false;			
			this.layers.form.update = false;
			this.layers.form.id = null;
			this.layers.obj = {
				soil_id: this.item.id,
				layer_num: this.layers.list.length + 1,
				dp: null,
				bd: null,
				awc: null,
				soil_k: null,
				carbon: null,
				clay: null,
				silt: null,
				sand: null,
				rock: null,
				alb: null,
				usle_k: null,
				ec: null,
				caco3: null,
				ph: null				
			};
			this.layers.form.show = true;
		},
		edit(item) {
			this.layers.form.update = true;
			this.layers.form.id = item.id;
			this.layers.obj = item;
			this.layers.obj.soil_id = this.item.id;
			this.layers.form.show = true;
		},
		askDelete(id, name) {
			this.layers.delete.id = id;
			this.layers.delete.name = name;
			this.layers.delete.show = true;
		},
		async confirmDelete() {
			this.layers.delete.error = null;
			this.layers.delete.saving = true;

			try {
				await this.deleteLayerDb(this.layers.delete.id);
				await this.getLayers();
				this.layers.delete.show = false;
			} catch (error) {
				this.layers.delete.error = this.logError(error, 'Unable to delete from database.');
			}

			this.layers.delete.saving = false;
		},
		async saveLayer() {
			this.layers.form.error = null;
			this.layers.form.saving = true;
			this.layers.form.validated = true;

			if (this.validateLayer()) {
				let action;
				if (this.layers.form.update) {
					action = this.putLayerDb(this.layers.form.id, this.layers.obj);
				} else {
					action = this.postLayerDb(this.layers.obj);
				}

				try {
					await action;
					await this.getLayers();
					//this.getTableFields();
					this.layers.form.validated = false;
					this.layers.form.show = false;
				} catch (error) {
					this.layers.form.error = this.logError(error, 'Unable to save layer to database.');
				}
			} 
			
			this.layers.form.saving = false;
		},
		validateLayer() {
			var valid = true;
			valid = valid && !this.isNullOrEmpty(this.layers.obj.layer_num);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.dp);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.bd);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.awc);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.soil_k);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.carbon);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.clay);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.silt);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.sand);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.rock);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.alb);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.usle_k);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.ec);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.caco3);
			valid = valid && !this.isNullOrEmpty(this.layers.obj.ph);
			return true;
		},
		getMeta(field, item) {
			let label = field[0].toUpperCase() + field.substring(1);
			let css = 'text-right';
			let formatter = (value) => { return Number.isInteger(Number(value)) ? value : Number(value).toFixed(3) }

			let textFields = [
				'name',
				'description'
			];

			if (textFields.includes(field) || isNaN(item)) {
				css = 'text-left';
				formatter = undefined;
			}

			return {
				label: label,
				css: css,
				formatter: formatter
			};
		}
	}
}
</script>