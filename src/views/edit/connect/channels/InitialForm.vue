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
                <object-selector name="Channels" table="init_cha" @change="bulkSelectionChange"></object-selector>
            </div>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="org_min_name" class="d-inline"></b-form-checkbox>
							Organic Mineral Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="org_min_pop" />
						</template>
						<b-popover target="org_min_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Organic Mineral" file="om_water.ini" db="om_water_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.org_min_name"
							:value="item.org_min_name"
							table-name="om_water_ini" route-name="InitOMWaterEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="pest_name" class="d-inline"></b-form-checkbox>
							Pesticide Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="pest_pop" />
						</template>
						<b-popover target="pest_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Pesticides Water" file="pest_water.ini" db="pest_water_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.pest_name"
							:value="item.pest_name"
							table-name="pest_water_ini" route-name="InitPestWaterEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="path_name" class="d-inline"></b-form-checkbox>
							Pathogen Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="path_pop" />
						</template>
						<b-popover target="path_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Pathogens Water" file="path_water.ini" db="path_water_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.path_name"
							:value="item.path_name"
							table-name="path_water_ini" route-name="InitPathWaterEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="hmet_name" class="d-inline"></b-form-checkbox>
							Heavy Metal Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hmet_pop" />
						</template>
						<b-popover target="hmet_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Heavy Metals Water" file="hmet_water.ini" db="hmet_water_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.hmet_name"
							:value="item.hmet_name"
							table-name="hmet_water_ini" route-name="InitHmetWaterEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col md>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="salt_name" class="d-inline"></b-form-checkbox>
							Salt Properties
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="salt_pop" />
						</template>
						<b-popover target="salt_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Salt Water" file="salt_water.ini" db="salt_water_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.salt_name"
							:value="item.salt_name"
							table-name="salt_water_ini" route-name="InitSaltWaterEdit"></type-ahead-and-go>
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
	name: 'ChannelInitialForm',
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
				return this.$http.put('channels/initial/many/' + this.projectDbUrl, data);
			else if (this.isUpdate)
				return this.$http.put('channels/initial/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('channels/initial/post/' + this.projectDbUrl, data);
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
                        this.$router.push({ name: 'ChannelsInitial'});
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