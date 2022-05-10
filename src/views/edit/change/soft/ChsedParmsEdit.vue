<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="ch_sed_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/chsedparms">Channel Parameters</router-link>
			/ Edit
		</file-header>

		<parms-form is-update
			:item="item"  
			:api-url="apiUrl"
			:parm-list="['cov', 'erod', 'shear_bnk', 'hc_erod']"
			redirect-route="SoftCalibrationChsedParms" />
	</project-container>
</template>

<script>
import ParmsForm from './ParmsForm';

export default {
	name: 'SoftCalibrationChsedParmsEdit',
	components: {
		ParmsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			apiUrl: 'change/soft/parms/chsed',
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
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`${this.apiUrl}/${this.$route.params.id}/${this.projectDbUrl}`);
                this.item = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get parameter from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>