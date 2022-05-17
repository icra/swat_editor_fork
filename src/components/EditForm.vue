<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
        <b-toast id="item-copied" variant="success" solid title="Item copied" toaster="b-toaster-top-center">
			Your item has been copied. Redirecting to list...
		</b-toast>

		<b-form @submit.prevent="save" :validated="page.validated">
            <div v-if="!page.bulk.show && !hideName">
                <b-form-group label="Name">
                    <b-form-input type="text" v-model="item.name" required autofocus maxLength="16"
                                v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
                </b-form-group>

                <b-form-group v-if="showDescription" label="Description (optional)">
                    <b-form-input type="text" v-model="item.description" />
                </b-form-group>
            </div>
            <div v-else-if="!hideName">
                <b-alert variant="info" :show="includeHruOption">
                    <div class="mb-1">
                        {{name}} objects can be associated with either routing units or HRUs.
                        Only one type may be edited in bulk mode at a time.
                    </div>
                    <b-form-select v-if="includeHruOption" v-model="doHru">
                    <b-form-select-option :value="null">Choose a type...</b-form-select-option>
                    <b-form-select-option :value="false">Find objects applied to routing units</b-form-select-option>
                    <b-form-select-option :value="true">Find objects applied to HRUs</b-form-select-option>
                </b-form-select>
                </b-alert>

                <object-selector v-if="!includeHruOption || doHru !== null"
                    :name="name" :table="objectSelectorTable" :is-hru="isHru || (includeHruOption && doHru)" :no-gis="noGis"
                    @change="bulkSelectionChange"></object-selector>
            </div>

            <page-loading :loading="page.loading"></page-loading>
            <table class="table edit" v-if="!page.loading">
				<thead class="thead-light">
					<tr>
                        <th v-if="page.bulk.show">
                            Apply
                            <font-awesome-icon :icon="['fas', 'question-circle']" class="text-secondary" v-b-tooltip.hover.top="'Check to apply changes to this field to the selected objects above.'" />
                        </th>
						<th v-if="hasDatasetItem">
                            Dataset Value
                            <font-awesome-icon :icon="['fas', 'question-circle']" class="text-secondary" v-b-tooltip.hover.top="'The value from your swatplus_datasets database for this record is shown in this column for comparison.'" />
                        </th>
						<th v-if="hasDatasetItem" colspan="2">Your Value</th>
						<th v-else colspan="2">Value</th>
                        <th>Description</th>
						<th>SWAT+ Variable</th>
						<th v-if="!hasDatasetItem">Default</th>
						<th v-if="showRange">Recommended Range</th>
					</tr>
				</thead>
				<tbody>
					<tr-var-editor v-for="(v, i) in vars" :key="i" :bulk-mode="page.bulk.show" @change="selectedVarChange"
						:id="'item_' + v.name" :required="!page.bulk.show" :show_range="showRange"
						v-model="item[v.name]" :value="item[v.name]"
						:var_def="v"
                        :show-datasets="hasDatasetItem" :dataset-value="hasDatasetItem ? datasetItem[v.name] : null" />
				</tbody>
			</table>

            <error-alert :text="page.error"></error-alert>

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
                <b-button v-if="!hideCopy && isUpdate && !page.bulk.show" type="button" variant="info" class="ml-auto" @click="page.copy.show = true">Copy</b-button>
			</action-bar>
		</b-form>

        <b-modal v-model="page.copy.show" size="lg" title="Copy Item" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.copy.error"></error-alert>

			<p>
                Would you like to make a copy of this entry? Enter a name for the copy below. Once copied, you'll be redirected to the list of items.
            </p>

            <b-form-group label="Name of item copy">
                <b-form-input type="text" v-model="page.copy.name" required maxLength="16"  v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
            </b-form-group>

			<div slot="modal-footer">
				<save-button :saving="page.copy.saving" type="button" @click.native="copy" text="Copy"></save-button>
				<b-button type="button" variant="secondary" @click="page.copy.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import ObjectSelector from '@/components/ObjectSelector.vue';
import TrVarEditor from '@/components/TrVarEditor';

export default {
	name: 'EditForm',
	components: {
		ObjectSelector, TrVarEditor
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
        redirectPath: {
			type: Boolean,
			default: false
        },
        showDescription: {
			type: Boolean,
			default: false
        },
        showRange: {
			type: Boolean,
			default: false
		},
		isUpdate: {
			type: Boolean,
			default: false
		},
		updateMany: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
		vars: {
			required: true
        },
		getDatasetsRecord: {
			type: Boolean,
			default: false
		},
		hideName: {
			type: Boolean,
			default: false
		},
		noId: {
			type: Boolean,
			default: false
		},
		allowBulkEdit: {
			type: Boolean,
			default: false
        },
        isHru: {
			type: Boolean,
			default: false
		},
		noGis: {
			type: Boolean,
			default: false
		},
		table: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		includeHruOption: {
			type: Boolean,
			default: false
        },
        hideCopy: {
            type: Boolean,
			default: false
        },

	},
	data() {
		return {
			page: {
				loading: false,
				error: null,
                saving: false,
                validated: false,
                checkAll: false,
                bulk: {
                    show: false,
                    error: null,
                    saving: false
                },
                copy: {
                    show: false,
                    error: null,
                    saving: false,
                    name: null
                }
            },
            selectedItems: [],
            selectedVars: [],
            datasetItem: {},
            hasDatasetItem: false,
            doHru: null
		}
    },
    async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		putDb(data) {

			if (this.page.bulk.show){
				return this.$http.put(this.apiUrl + '/many/' + this.projectDbUrl, data);
			}
            else if (this.isUpdate){
				if (this.noId){
					console.log(this.$http.put(this.apiUrl + '/' + this.projectDbUrl, data))
				} else{
					return this.$http.put(this.apiUrl + '/' + this.item.id + '/' + this.projectDbUrl, data);
				}
			} else {
				return this.$http.post(this.apiUrl + '/post/' + this.projectDbUrl, data)

			}
        },
        getDatasetsDb(name) {
            return this.$http.get(this.apiUrl + '/datasets/' + name + '/' + this.datasetsDbUrl);
        },
        async get() {
            this.page.loading = true;
            this.selectedItems.push(this.item.id);

            if (this.getDatasetsRecord) {
                try {
                    const response = await this.getDatasetsDb(this.item.name);
                    this.datasetItem = response.data;
                    this.hasDatasetItem = true;
                } catch (error) {
                    this.hasDatasetItem = false;
                }
            }

            this.page.loading = false;
        },
		async save() {
			this.page.error = null;
			this.page.saving = true;
            this.page.validated = true;
            let val_error = false;

            let item = {};
            if (!this.page.bulk.show) {
                item = this.item;
                if (!this.hideName) item.name = this.validName(this.item.name);
            } else {
                if (this.selectedItems.length < 1) {
                    val_error = true;
                    this.page.error = 'You must select at least one record to edit.';
                }
                else if (this.selectedVars.length < 1) {
                    val_error = true;
                    this.page.error = 'You must check at least one field to edit.';
                }
                else {
                    item = {};
                    item.selected_ids = this.selectedItems;

                    for (let v of this.selectedVars) {
                        item[v] = this.item[v];
                    }
                }
            }
            this.log(item);
            if (!val_error) {
                try {
                    const response = await this.putDb(item);

                    if (this.isUpdate || this.updateMany)
                        this.$bvToast.show('changes-saved');
                    else {
                        if (this.redirectPath) this.$router.push({ path: this.redirectRoute});
                        else this.$router.push({ name: this.redirectRoute});
                    }
                } catch (error) {
                    this.page.error = this.logError(error, 'Unable to save changes to database.');
                }
            }

            this.page.saving = false;
            this.page.validated = false;
        },
        async copy() {
            this.page.copy.error = null;
            this.page.copy.saving = true;

            if (this.isNullOrEmpty(this.page.copy.name)) {
                this.page.copy.error = 'Please enter a name.';
            } else {
                try {
                    let item = this.item;
                    item.id = null;
                    item.name = this.validName(this.page.copy.name);

                    await this.$http.post(`${this.apiUrl}/post/${this.projectDbUrl}`, item);

                    this.$bvToast.show('item-copied');
                    this.$router.push({ name: this.redirectRoute});
                } catch (error) {
                    this.page.copy.error = this.logError(error, 'Unable to save changes to database.');
                }
            }

            this.page.copy.saving = false;
        },
        bulkSelectionChange(selection) {
            this.selectedItems = selection;
        },
        selectedVarChange(selection) {
            this.log(selection);
            if (selection.value && !this.selectedVars.includes(selection.name)) {
                this.selectedVars.push(selection.name);
            }
            else if (!selection.value && this.selectedVars.includes(selection.name)) {
                this.selectedVars = this.selectedVars.filter(function(el) { return el !== selection.name });
            }
            this.log(this.selectedVars);
        }
    },
    computed: {
        objectSelectorTable() {
            return this.includeHruOption && this.doHru ? `${this.table}_hru` : this.table;
        }
    }
}
</script>
