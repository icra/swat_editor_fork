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

                <b-form-group label="Description (optional)">
                    <b-form-input type="text" v-model="item.description" />
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
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="cal_group" class="d-inline"></b-form-checkbox>
							Calibration Group
						</template>
						<b-form-input type="text" v-model="item.cal_group" maxLength="16" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="plnt_com_name" class="d-inline"></b-form-checkbox>
							Plant Community
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="plnt_com_pop" />
						</template>
						<b-popover target="plnt_com_pop" triggers="hover focus">
							<reference-label section="Initialization Data / Plant Communities" file="plant.ini" db="plant_ini" api-url="plant_ini" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.plnt_com_name"
							:value="item.plnt_com_name"
							table-name="plant_ini" route-name="InitPlantEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label-for="mgt_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="mgt_name" class="d-inline"></b-form-checkbox>
							Management Schedule
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="mgt_pop" />
						</template>
						<b-popover target="mgt_pop" triggers="hover focus">
							<reference-label section="Management Schedules" file="management.sch" db="management_sch" api-url="mgt_sch" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.mgt_name"
							:value="item.mgt_name"
							table-name="mgt_sch" route-name="ManagementEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Curve Number" label-for="cn2_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="cn2_name" class="d-inline"></b-form-checkbox>
							Curve Number
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="cn2_pop" />
						</template>
						<b-popover target="cn2_pop" triggers="hover focus">
							<reference-label section="Curve Numbers" file="cntable.lum" db="cntable_lum" api-url="cntable" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.cn2_name"
							:value="item.cn2_name"
							table-name="cntable" route-name="CntableEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label-for="urban_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="urban_name" class="d-inline"></b-form-checkbox>
							Urban Land Use
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="urban_pop" />
						</template>
						<b-popover target="urban_pop" triggers="hover focus">
							<reference-label section="Databases / Urban" file="urban.urb" db="urban_urb" api-url="db/urban" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.urban_name"
							:value="item.urban_name"
							table-name="urban" route-name="UrbanEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group>
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="urb_ro" class="d-inline"></b-form-checkbox>
							Urban Runoff
						</template>
						<b-form-select id="urb_ro" v-model="item.urb_ro" :options="urb_ro_options" />
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label-for="cons_prac_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="cons_prac_name" class="d-inline"></b-form-checkbox>
							Conservation Practices
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="cons_prac_pop" />
						</template>
						<b-popover target="cons_prac_pop" triggers="hover focus">
							<reference-label section="Conservation Practices" file="cons_prac.lum" db="cons_prac_lum" api-url="cons_prac" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.cons_prac_name"
							:value="item.cons_prac_name"
							table-name="cons_prac" route-name="ConsPracticeEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label-for="ov_mann_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="ov_mann_name" class="d-inline"></b-form-checkbox>
							Overland Flow Manning's n
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="ov_mann_pop" />
						</template>
						<b-popover target="ov_mann_pop" triggers="hover focus">
							<reference-label section="Overland Flow Manning's n" file="ovn_table.lum" db="ovn_table_lum" api-url="ovntable" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.ov_mann_name"
							:value="item.ov_mann_name"
							table-name="ovntable" route-name="OvntableEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label-for="tile_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="tile_name" class="d-inline"></b-form-checkbox>
							Tile Drain
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="tile_pop" />
						</template>
						<b-popover target="tile_pop" triggers="hover focus">
							<reference-label section="Structural / Tile Drains" file="tiledrain.str" db="tiledrain_str" api-url="structural/tiledrain" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.tile_name"
							:value="item.tile_name"
							table-name="tiledrain_str" route-name="TiledrainStrEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label-for="sep_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="sep_name" class="d-inline"></b-form-checkbox>
							Septic Tank
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="sep_pop" />
						</template>
						<b-popover target="sep_pop" triggers="hover focus">
							<reference-label section="Structural / Septic Tank" file="septic.str" db="septic_str" api-url="structural/septic" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.sep_name"
							:value="item.sep_name"
							table-name="septic_str" route-name="SepticStrEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col>
					<b-form-group label-for="vfs_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="vfs_name" class="d-inline"></b-form-checkbox>
							Filter Strip
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="vfs_pop" />
						</template>
						<b-popover target="vfs_pop" triggers="hover focus">
							<reference-label section="Structural / Filter Strips" file="filterstrip.str" db="filterstrip_str" api-url="structural/filterstrip" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.vfs_name"
							:value="item.vfs_name"
							table-name="filterstrip_str" route-name="FilterstripStrEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label-for="grww_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="grww_name" class="d-inline"></b-form-checkbox>
							Grassed Waterway
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="grww_pop" />
						</template>
						<b-popover target="grww_pop" triggers="hover focus">
							<reference-label section="Structural / Grassed Waterways" file="grassedww.str" db="grassedww_str" api-url="structural/grassedww" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.grww_name"
							:value="item.grww_name"
							table-name="grassedww_str" route-name="GrassedwwStrEdit"></type-ahead-and-go>
					</b-form-group>
				</b-col>
			</b-row>

			<b-row>
				<b-col cols="6">
					<b-form-group label-for="bmp_name">
						<template slot="label">
							<b-form-checkbox v-if="page.bulk.show" v-model="selectedVars" value="bmp_name" class="d-inline"></b-form-checkbox>
							Best Management Practices
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="bmp_pop" />
						</template>
						<b-popover target="bmp_pop" triggers="hover focus">
							<reference-label section="Structural / Best Management Practices" file="bmpuser.str" db="bmpuser_str" api-url="structural/bmpuser" />
						</b-popover>

						<type-ahead-and-go :show-button="isUpdate"
							v-model="item.bmp_name"
							:value="item.bmp_name"
							table-name="bmpuser_str" route-name="BmpuserStrEdit"></type-ahead-and-go>
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
	name: 'LanduseForm',
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
            selectedVars: [],
			urb_ro_options: [
				{ value: null, text: 'not applicable' },
				{ value: 'buildup_washoff', text: 'buildup_washoff' },
				{ value: 'usgs_reg', text: 'usgs_reg' }
			]
		}
	},
	methods: {
		putDb(data) {
			if (this.page.bulk.show)
				return this.$http.put(`/landuse/many/${this.projectDbUrl}`, data);
			else if (this.isUpdate)
				return this.$http.put(`/landuse/${this.item.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`/landuse/post/${this.projectDbUrl}`, data);
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
						this.$router.push({ name: 'Landuse'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}
            
            this.page.saving = false;
            this.page.validated = false;
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