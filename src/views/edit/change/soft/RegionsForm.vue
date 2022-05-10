<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
            <b-form-group label="Region name">
				<b-form-input type="text" v-model="item.name" required autofocus />
			</b-form-group>

			<div v-if="isUpdate">
				<h2 class="my-3">Calibration Items</h2>
				<div v-if="rows.length < 1" class="alert alert-primary">
					This region does not have any calibration items. 
					<a href="#" @click.prevent="addRow">Add now.</a>
				</div>
				<div class="table-responsive" v-if="rows.length > 0">
					<table class="table table-striped table-sm table-grid border-bottom">
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th v-for="(v, i) in vars" :key="i">{{v.name}}</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in rows" :key="row.id">
								<td><font-awesome-icon :icon="['fas', 'edit']" class="text-primary pointer" @click="editRow(row)" v-b-tooltip.hover.right="'Edit'" /></td>
								<td>{{row.name}}</td>
								<td v-for="(v, i) in vars" :key="i">{{row[v.name]}}</td>
								<td><font-awesome-icon :icon="['fas', 'times']" class="text-danger pointer" @click="removeRow(row)" v-b-tooltip.hover.right="'Delete'" /></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<action-bar>
				<save-button :saving="page.saving" @click.native="page.validated = true" />
				<b-button v-if="isUpdate" type="button" variant="info" @click="addRow" class="mr-1">Add Item</b-button>
				<back-button />
			</action-bar>
		</b-form>

		<b-modal v-model="modal.show" scrollable size="lg" :title="(modal.new ? 'Add' : 'Update') + ' Item'" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="modal.error"></error-alert>
			
			<b-form :validated="modal.validated">
				<b-form-group label="Name" v-if="!lumLookup">
					<b-form-input type="text" v-model="modal.row.name" required />
				</b-form-group>
				<b-form-group label="Land Use Management" v-else>
					<type-ahead-and-go 
						v-model="modal.row.name"
						:value="modal.row.name"
						table-name="lu_mgt" route-name="#"></type-ahead-and-go>
				</b-form-group>

				<table class="table edit">
					<thead class="thead-light">
						<tr>
							<th colspan="2">Value</th>
							<th>Description</th>
							<th>SWAT+ Variable</th>
							<th>Default</th>
						</tr>
					</thead>
					<tbody>
						<tr-var-editor v-for="(v, i) in vars" :key="i"
							:id="'item_' + v.name" required
							v-model="modal.row[v.name]" :value="modal.row[v.name]"
							:var_def="v" />
					</tbody>
				</table>
			</b-form>

			<div slot="modal-footer">
				<save-button :saving="modal.saving" @click.native="saveRow" />
				<b-button type="button" variant="secondary" @click="cancel">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import TrVarEditor from '@/components/TrVarEditor';

export default {
	name: 'RegionsForm',
	components: {
		TrVarEditor
	},
	props: {
        apiUrl: {
			type: String,
			required: true
        },
        redirectRoute: {
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
		initItems: {
			type: Array,
			required: false,
			default: () => []
		},
		vars: {
			required: false
		},
		lumLookup: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			page: {
				error: null,
				validated: false,
                saving: false
			},
			fields: [],
			modal: {
				show: false,
				validate: false,
				saving: false,
				error: null,

				new: false,
				editIndex: 0,
				row: {}
			},
			rows: this.initItems
		}
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
                return this.$http.put(this.apiUrl + '/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post(this.apiUrl + '/post/' + this.projectDbUrl, data);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
            this.page.validated = true;
            var val_error = false;
            var item = {
				name: this.item.name
			};

			if (this.isUpdate) {
				item.id = this.item.id;
				item.items = this.rows;
			}
            
            if (!val_error) {
                try {
                    const response = await this.putDb(item);

                    if (this.isUpdate || this.updateMany)
                        this.$bvToast.show('changes-saved');
                    else
                        this.$router.push({ name: this.redirectRoute, params: { id: response.data.id }});
                } catch (error) {
                    this.page.error = this.logError(error, 'Unable to save changes to database.');
                    this.page.saving = false;
                }
			}
			
			this.page.saving = false;
			this.page.validated = false;
		},
		addRow() {
			this.modal.row = {};
			this.modal.editIndex = 0;
			this.modal.new = true;
			this.modal.show = true;
		},
		editRow(row) {
			this.modal.row = JSON.parse(JSON.stringify(row));
			this.modal.editIndex = this.rows.indexOf(row);
			this.modal.new = false;
			this.modal.show = true;
		},
		removeRow(row) {
			this.rows.splice(this.rows.indexOf(row), 1);
		},
		saveRow() {
			if (this.modal.new) {
				this.rows.push(this.modal.row);
			} else {
				this.rows[this.modal.editIndex] = this.modal.row;
			}

			this.modal.show = false;
		},
		cancel() {
			this.modal.show = false;
		}
	}
}
</script>