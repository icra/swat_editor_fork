<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="cal_parms.cal" docs-path="change-calibration">
			<router-link to="/edit/change/hard">Hard Calibration</router-link>
			/ <router-link to="/edit/change/hard/parms">Parameters</router-link>
			/ Edit
		</file-header>

		<error-alert :text="page.saveError"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<p>
			Object type: {{item.obj_typ}}
		</p>
		<b-form :validated="page.validated" @submit.prevent="save">
			<b-form-group label="Absolute Minimum">
				<b-input-group :append="item.units">
					<b-form-input v-model.number="item.abs_min" type="number" step="any" class="limwid" required />
				</b-input-group>
				<div class="invalid-feedback">Required</div>
			</b-form-group>

			<b-form-group label="Absolute Maximum">
				<b-input-group :append="item.units">
					<b-form-input v-model.number="item.abs_max" type="number" step="any" class="limwid" required />
				</b-input-group>
				<div class="invalid-feedback">Required</div>
			</b-form-group>

			<action-bar>
				<save-button :saving="page.saving" @click.native="page.validated = true" />
				<back-button />
			</action-bar>
		</b-form>
	</project-container>
</template>

<style scoped>
.limwid {
	max-width: 200px;
}
</style>

<script>
export default {
	name: 'HardCalibrationParmsEdit',
	data() {
		return {
			page: {
				loading: false,
				error: null,
				validated: false,
				saving: false,
				saveError: null
			},
			item: {}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		getDb() {
			return this.$http.get('change/cal_parms/' + this.$route.params.id + '/' + this.projectDbUrl);
		},
		putDb(data) {
			return this.$http.put('change/cal_parms/' + this.$route.params.id + '/' + this.projectDbUrl, data);
		},
		async get() {	
			this.page.loading = true;
			this.page.error = null;

			try {
				const response = await this.getDb();
				this.item = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get calibration parameter from database.');
			}
				
			this.page.loading = false;
		},
		async save() {
			this.page.saveError = null;
			this.page.saving = true;
			this.page.validated = true;
			
			try {
				const response = await this.putDb(this.item);
				this.page.validated = false;
				this.$bvToast.show('changes-saved');
			} catch (error) {
				this.page.saveError = this.logError(error, 'Unable to save changes to database.');
			}

			this.page.saving = false;
		}
	}
}
</script>