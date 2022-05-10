<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="wb_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/wbparms">Water Balance Parameters</router-link>
			/ Edit
		</file-header>

		<parms-form is-update
			:item="item"  
			:api-url="apiUrl"
			:parm-list="['cn2', 'esco', 'lat_len', 'k_lo', 'slope', 'tconc', 'etco', 'perco', 'revapc', 'cn3_swf']"
			redirect-route="SoftCalibrationWbParms" />
	</project-container>
</template>

<script>
import ParmsForm from './ParmsForm';

export default {
	name: 'SoftCalibrationWbParmsEdit',
	components: {
		ParmsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			apiUrl: 'change/soft/parms/wb',
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