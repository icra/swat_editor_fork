<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<div v-if="!page.bulk.show">
                <b-form-group label="Name" label-for="name">
                    <b-form-input id="name" type="text" v-model="item.name" required autofocus maxLength="16" 
                        v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
                </b-form-group>

                <b-form-group label="Description (optional)" label-for="description">
                    <b-form-input id="description" type="text" v-model="item.description" />
                </b-form-group>
            </div>
            <div v-else>
                <object-selector name="Wetlands" table="wet_res" is-hru @change="bulkSelectionChange"></object-selector>
            </div>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="init_name" class="d-inline"></b-form-checkbox>
							Initial Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="init_pop" />
						</template>
						<b-popover target="init_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Initial" file="initial.res" db="initial_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.init_name"
							:value="item.init_name"
							table-name="init_res" route-name="ReservoirsInitialEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hyd_name" class="d-inline"></b-form-checkbox>
							Hydrology Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hyd_pop" />
						</template>
						<b-popover target="hyd_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Wetland Hydrology" file="hydrology.wet" db="hydrology_wet" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.hyd_name"
							:value="item.hyd_name"
							table-name="hyd_wet" route-name="ReservoirsWetlandsHydrologyEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="sed_name" class="d-inline"></b-form-checkbox>
							Sediment Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="sed_name_pop" />
						</template>
						<b-popover target="sed_name_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Sediment" file="sediment.res" db="sediment_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.sed_name"
							:value="item.sed_name"
							table-name="sed_res" route-name="ReservoirsSedimentEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="nut_name" class="d-inline"></b-form-checkbox>
							Nutrients Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="nut_name_pop" />
						</template>
						<b-popover target="nut_name_pop" triggers="hover focus">
							<reference-label section="Reservoirs / Nutrients" file="nutrients.res" db="nutrients_res" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.nut_name"
							:value="item.nut_name"
							table-name="nut_res" route-name="ReservoirsNutrientsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md="6">
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="rel_name" class="d-inline"></b-form-checkbox>
							Release Decision Table
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="rel_name_pop" />
						</template>
						<b-popover target="rel_name_pop" triggers="hover focus">
							<reference-label section="Decision Tables / Reservoir Release" file="res_rel.dtl" db="d_table_dtl" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.rel_name"
							:value="item.rel_name"
							table-name="res_rel.dtl" route-name="DecisionsEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<action-bar>
				<div v-if="page.bulk.show">
                    <save-button :saving="page.saving" text="Save Bulk Changes" />
                    <b-button variant="secondary" @click="page.bulk.show = false; page.error = null">Exit Bulk Edit Mode</b-button>
                </div>
                <div v-else>
                    <b-dropdown split :disabled="page.saving" split-button-type="submit" variant="primary" text="Save Changes" class="mr-1">
                        <b-dropdown-item @click="page.bulk.show = true">Make changes to multiple records...</b-dropdown-item>
                    </b-dropdown>
                    <back-button />
                </div>
			</action-bar>
		</b-form>
	</div>
</template>

<script>
import ObjectSelector from '@/components/ObjectSelector.vue';

export default {
	name: 'ReservoirsInitialForm',
	components: { 
		ObjectSelector 
	},
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			page: {
				error: null,
				validated: false,
				saving: false,
                bulk: {
                    show: false
                }
            },
            selectedItems: [],
            selectedVars: []
		}
	},
	methods: {
		putDb(data) {
			if (this.page.bulk.show)
				return this.$http.put('reservoirs/wetlands/many/' + this.projectDbUrl, data);
			else if (this.isUpdate)
				return this.$http.put('reservoirs/wetlands/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('reservoirs/wetlands/post/' + this.projectDbUrl, data);
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

                    if (this.isUpdate)
                        this.$bvToast.show('changes-saved');
                    else
                        this.$router.push({ name: 'ReservoirsWetlands'});
                } catch (error) {
                    this.page.error = this.logError(error, 'Unable to save changes to database.');
                }
            }
            
            this.page.saving = false;
            this.page.validated = false;
        },
        bulkSelectionChange(selection) {
            this.selectedItems = selection;
        }
	}
}
</script>