<template>
	<div>
		<b-alert variant="primary" show>
			You are in bulk edit mode. Select the objects you want to edit then check the fields to which you 
			want to apply to the selected.
		</b-alert>

		<error-alert :text="page.error"></error-alert>
		<div class="d-flex">
			<div>
				<page-loading :loading="page.loading.subbasins"></page-loading>
				<div v-if="!page.loading.subbasins && options.subbasins.length > 0 " class="scroll-check mb-4">
					<div class="check-all">
						<b-form-checkbox @change="toggleAllSubbasins" class="d-inline">Select Subbasins</b-form-checkbox>
						<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer ml-1" id="sub_pop" />
						<b-popover target="sub_pop" triggers="hover focus">
							<div class="sm-pop">
								Filter {{name.toLowerCase()}} by subbasin.
							</div>
						</b-popover>
					</div>
					<div class="items">
						<b-form-checkbox-group v-model="selection.subbasins" stacked>
							<div class="item" v-for="o in options.subbasins" :key="o.value">
								<b-form-checkbox :value="o.value">{{o.text}}</b-form-checkbox>
							</div>
						</b-form-checkbox-group>
					</div>
				</div>
			</div>
			<div v-if="isHru && !page.loading.subbasins">
				<page-loading :loading="page.loading.landuse"></page-loading>
				<div v-if="!page.loading.landuse && options.landuse.length > 0" class="scroll-check mb-4 ml-3">
					<div class="check-all">
						<b-form-checkbox @change="toggleAllLanduse">Select Land Use</b-form-checkbox>
					</div>
					<div class="items">
						<b-form-checkbox-group v-model="selection.landuse" stacked>
							<div class="item" v-for="o in options.landuse" :key="o.value">
								<b-form-checkbox :value="o.value">{{o.text}}</b-form-checkbox>
							</div>
						</b-form-checkbox-group>
					</div>
				</div>
			</div>
			<div v-if="isHru && !page.loading.subbasins && !page.loading.landuse">
				<page-loading :loading="page.loading.soils"></page-loading>
				<div v-if="!page.loading.soils && options.landuse.length > 0 && options.soils.length > 0" class="scroll-check mb-4 ml-3">
					<div class="check-all">
						<b-form-checkbox @change="toggleAllSoils">Select Soils</b-form-checkbox>
					</div>
					<div class="items">
						<b-form-checkbox-group v-model="selection.soils" stacked>
							<div class="item" v-for="o in options.soils" :key="o.value">
								<b-form-checkbox :value="o.value">{{o.text}}</b-form-checkbox>
							</div>
						</b-form-checkbox-group>
					</div>
				</div>
			</div>
			<div v-if="!page.loading.subbasins && !page.loading.landuse && !page.loading.soils">
				<page-loading :loading="page.loading.objects"></page-loading>
				<div v-if="!page.loading.objects && options.objects.length > 0 && (noGis || !isHru || (options.landuse.length > 0 && options.soils.length > 0))" 
					:class="noGis || options.subbasins.length < 1 ? 'scroll-check mb-4' : 'scroll-check mb-4 ml-3'">
					<div class="check-all">
						<b-form-checkbox v-model="all.objects" @change="toggleAllObjects" class="d-inline">Select {{name}}</b-form-checkbox>
						<font-awesome-icon v-if="options.subbasins.length > 0" :icon="['fas', 'question-circle']" class="text-info pointer ml-1" id="obj_pop" />
						<b-popover target="obj_pop" triggers="hover focus">
							<div class="sm-pop">
								{{name}} in this list are based on your 
								{{isHru ? 'subbasin/landuse/soil' : 'subbasin'}} selections.
								Check the {{name.toLowerCase()}} to which to apply your changes.
							</div>
						</b-popover>
					</div>
					<div class="items">
						<b-form-checkbox-group v-model="selection.objects" stacked>
							<div class="item" v-for="o in options.objects" :key="o.value">
								<b-form-checkbox :value="o.value">{{o.text}}</b-form-checkbox>
							</div>
						</b-form-checkbox-group>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ObjectSelector',
	props: {
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
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			page: {
				error: null,
				loading: {
					subbasins: false,
					landuse: false,
					soils: false,
					objects: false
				}
			},
			options: {
				subbasins: [],
				landuse: [],
				soils: [],
				objects: []
			},
			selection: {
				subbasins: [],
				landuse: [],
				soils: [],
				objects: []
			},
			all: {
				objects: false
			}
		}
	},
    async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		async get() {
			if (!this.noGis) this.page.loading.subbasins = true;
			this.page.error = null;

			try {
				if (this.noGis) {
					await this.getObjects();
				} else {
					const response = await this.$http.get(`subbasinlist/${this.projectDbUrl}`);
					this.log(response.data);
					this.options.subbasins = response.data;

					if (this.options.subbasins.length < 1) await this.getObjects();
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get objects from database.');
			}

			this.page.loading.subbasins = false;
		},
		async getLanduse() {
			this.page.error = null;
			this.page.loading.landuse = true;
			this.options.landuse = [];
			this.selection.landuse = [];
			this.options.soils = [];
			this.selection.soils = [];
			this.options.objects = [];
			this.selection.objects = [];

			try {
				let data = {
					selected_subs: this.selection.subbasins
				};
				const response = await this.$http.post(`landuselist/${this.projectDbUrl}`, data);
				this.options.landuse = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get subbasins from database.');
			}

			this.page.loading.landuse = false;
		},
		async getSoils() {
			this.page.error = null;
			this.page.loading.soils = true;
			this.options.soils = [];
			this.selection.soils = [];
			this.options.objects = [];
			this.selection.objects = [];

			try {
				let data = {
					selected_subs: this.selection.subbasins,
					selected_landuse: this.selection.landuse
				};
				const response = await this.$http.post(`soillist/${this.projectDbUrl}`, data);
				this.options.soils = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get subbasins from database.');
			}

			this.page.loading.soils = false;
		},
		async getObjects() {
			this.page.error = null;
			this.page.loading.objects = true;
			this.options.objects = [];
			this.selection.objects = [];

			try {
				let data = {
					selected_subs: this.selection.subbasins,
					selected_landuse: this.selection.landuse,
					selected_soils: this.selection.soils
				};
				this.log(data);
				const response = await this.$http.post(`matchingobjlist/${this.table}/${this.projectDbUrl}`, data);
				this.options.objects = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get subbasins from database.');
			}

			this.page.loading.objects = false;
		},
		toggleAllSubbasins(checked) {
			this.selection.subbasins = checked ? this.options.subbasins.map(function (i) { return i.value }) : [];
		},
		toggleAllLanduse(checked) {
			this.selection.landuse = checked ? this.options.landuse.map(function (i) { return i.value }) : [];
		},
		toggleAllSoils(checked) {
			this.selection.soils = checked ? this.options.soils.map(function (i) { return i.value }) : [];
		},
		toggleAllObjects(checked) {
			this.selection.objects = checked ? this.options.objects.map(function (i) { return i.value }) : [];
		}
	},
	watch: {
		async selectedSubbasins() {
			if (this.selection.subbasins.length > 0) {
				if (this.isHru) await this.getLanduse();
				else {
					await this.getObjects();
					this.toggleAllObjects(true);
					this.all.objects = true;
				}
			} else {
				this.options.objects = [];
				this.selection.objects = [];
			}
		},
		async selectedLanduse() {
			if (this.selection.landuse.length > 0)
				await this.getSoils();
		},
		async selectedSoils() {
			if (this.selection.soils.length > 0) {
				await this.getObjects();
				this.toggleAllObjects(true);
				this.all.objects = true;
			}
		},
		selectedObjects() {
			this.$emit('change', this.selection.objects);
		},
		async isHru() {
			this.options.objects = [];
			this.selection.objects = [];
			this.selection.subbasins = [];
		}
	},
	computed: {
		selectedSubbasins() {
			return this.selection.subbasins;
		},
		selectedLanduse() {
			return this.selection.landuse;
		},
		selectedSoils() {
			return this.selection.soils;
		},
		selectedObjects() {
			return this.selection.objects;
		}
	}
}
</script>