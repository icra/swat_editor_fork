<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibration'">
			<file-header input-file="codes.sft" docs-path="change-calibration">
				Soft Calibration
			</file-header>

			<p>
				The soft calibration codes file contains the input variables for the characteristics of the calibration update properties.
				Do you want to include and configure these codes in your model?
			</p>
			
			<error-alert :text="page.saveError"></error-alert>
			<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
				Your changes have been saved.
			</b-toast>

			<b-form @submit="submit" :validated="page.validated">
				<b-form-group>
					<b-form-radio-group id="codes_use"
						buttons button-variant="outline-primary"
						v-model="codes.use"
						:options="codes.useOptions" />
				</b-form-group>

				<b-list-group v-if="codes.use">
					<b-list-group-item><b-form-checkbox v-model="item.hyd_hru">Calibrate hydrologic balance for hru by land use in each region</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.hyd_hrulte">Calibrate hydrologic balance for hru_lte by land use in each region</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.plnt">Calibrate plant growth by land use (by plant) in each region</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.sed">Calibrate sediment yield by land use in each region</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.nut">Calibrate nutrient balance by land use in each region</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.ch_sed">Calibrate channel widening and bank accretion by stream order</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.ch_nut">Calibrate channel nutrient balance by stream order</b-form-checkbox></b-list-group-item>
					<b-list-group-item><b-form-checkbox v-model="item.res">Calibrate reservoir budgets by reservoir</b-form-checkbox></b-list-group-item>
				</b-list-group>
				
			
				<action-bar>
					<save-button :saving="page.saving" />
                    <back-button />
				</action-bar>
			</b-form>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'CalCodes',
	data() {
		return {
			apiUrl: 'change/codes/',
			page: {
				loading: false,
				error: null,
				validated: false,
				saving: false,
				saveError: null
			},
			item: {},
			codes: {
				use: false,
				useOptions: [
					{ value: false, text: 'No, do not use' },
					{ value: true, text: 'Yes, include' }
				]
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		getDb() {
			return this.$http.get(this.apiUrl + this.projectDbUrl);
		},
		putDb(data) {
			return this.$http.put(this.apiUrl + this.projectDbUrl, data);
		},
		deleteDb() {
			return this.$http.delete(this.apiUrl + this.projectDbUrl);
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.getDb();
				this.item = response.data;
				if ('id' in this.item)
					this.codes.use = true;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get calibration codes from database.');
			}
			
			this.page.loading = false;
		},
		async submit() {
			if (this.codes.use)
				return await this.save();
			else
				return await this.delete();
		},
		async save() {
			this.page.saveError = null;
			this.page.saving = true;
			this.page.validated = true;
			
			try {
				const response = await this.putDb(this.item);
				this.$bvToast.show('changes-saved');
			} catch (error) {
				this.page.saveError = this.logError(error, 'Unable to save changes to database.');
			}
			
			this.page.saving = false;
			this.page.validated = false;
		},
		async delete() {
			this.page.saveError = null;
			this.page.saving = true;

			try {
				const response = await this.deleteDb();
			} catch (error) {
				this.page.saveError = this.logError(error, 'Unable to delete from database.');
			}
			
			this.page.saving = false;
		}
	}
}
</script>