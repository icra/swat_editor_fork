<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="!page.bulk.show">
                <b-form-group label="Name">
                    <b-form-input type="text" v-model="item.name" required autofocus maxLength="16" 
                        v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
                </b-form-group>
            </div>
            <div v-else>
                <b-alert variant="primary" show>
                    You are in bulk edit mode. Select the objects you want to edit then check the fields to which you want to apply to the selected.
                </b-alert>

                <div class="scroll-check mb-4">
                    <div class="check-all">
                        <b-form-checkbox @change="checkAll">Select all</b-form-checkbox>
                    </div>
                    <div class="items">
                        <b-form-checkbox-group id="selectedItems" name="selectedItems" v-model="selectedItems">
                            <div class="item" v-for="(v, i) in itemList" :key="i"><b-form-checkbox :value="v.id">{{ v.name }}</b-form-checkbox></div>
                        </b-form-checkbox-group>
                    </div>
                </div>
            </div>

			<b-row>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="sw_frac" class="d-inline"></b-form-checkbox>
							Soil Water Fraction
						</template>
						<b-form-input v-model.number="item.sw_frac" type="number" required step="any"></b-form-input>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="nutrients_name" class="d-inline"></b-form-checkbox>
							Nutrients
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="nutrients_name_pop" />
						</template>
						<b-popover target="nutrients_name_pop" triggers="hover focus">
							<reference-label section="Soils / Nutrients" file="nutrients.sol" db="nutrients_sol" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.nutrients_name"
							:value="item.nutrients_name"
							table-name="soil_nut" route-name="SoilNutrientsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="pest_name" class="d-inline"></b-form-checkbox>
							Pesticides
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="pest_name_pop" />
						</template>
						<b-popover target="pest_name_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Pesticides HRU" file="pest_hru.ini" db="pest_hru_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.pest_name"
							:value="item.pest_name"
							table-name="pest_hru_ini" route-name="PestHruEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="path_name" class="d-inline"></b-form-checkbox>
							Pathogens
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="path_name_pop" />
						</template>
						<b-popover target="path_name_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Pathogens HRU" file="path_hru.ini" db="path_hru_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.path_name"
							:value="item.path_name"
							table-name="path_hru_ini" route-name="PathHruEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hmet_name" class="d-inline"></b-form-checkbox>
							Heavy Metals
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hmet_name_pop" />
						</template>
						<b-popover target="hmet_name_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Heavy Metals HRU" file="hmet_hru.ini" db="hmet_hru_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.hmet_name"
							:value="item.hmet_name"
							table-name="hmet_hru_ini" route-name="HmetHruEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="salt_name" class="d-inline"></b-form-checkbox>
							Salt
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="salt_name_pop" />
						</template>
						<b-popover target="salt_name_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Salt HRU" file="salt_hru.ini" db="salt_hru_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.salt_name"
							:value="item.salt_name"
							table-name="salt_hru_ini" route-name="SaltHruEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				
			</b-row>

			<action-bar>
				<div v-if="page.bulk.show">
                    <save-button :saving="page.saving" text="Save Bulk Changes" />
                    <b-button variant="secondary" @click="page.bulk.show = false; page.error = null">Exit Bulk Edit Mode</b-button>
                </div>
                <div v-else>
                    <b-dropdown v-if="allowBulkEdit && itemList && itemList.length > 1" split :disabled="page.saving" split-button-type="submit" variant="primary" text="Save Changes" class="mr-1">
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
export default {
	name: 'InitSoilPlantForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
        itemList: {
            type: Array,
            required: false
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
                checkAll: false,
                bulk: {
                    show: false,
                    error: null,
                    saving: false
                }
			},
            selectedItems: [],
            selectedVars: []
		}
	},
	methods: {
		putDb(data) {
			if (this.page.bulk.show)
				return this.$http.put(`/soil_plant/many/${this.projectDbUrl}`, data);
			else if (this.isUpdate)
				return this.$http.put(`/soil_plant/${this.item.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`/soil_plant/post/${this.projectDbUrl}`, data);
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
			
			if (!val_error) {
				try {
					const response = await this.putDb(item);
            		this.page.validated = false;

					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'InitSoilPlant'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}
            
            this.page.saving = false;
		},
        checkAll() {
            this.page.checkAll = !this.page.checkAll;
            for (var i = 0; i < this.itemList.length; i++) {
                var id = this.itemList[i].id;

                if (this.page.checkAll) {
                    if (this.selectedItems.indexOf(id) == -1) {
                        this.selectedItems.push(id);
                    }
                } else {
                    if (this.selectedItems.indexOf(id) > -1) {
                        this.selectedItems = this.selectedItems.filter(function(el) { return el != id; });
                    }
                }
            }
        }
	}
}
</script>