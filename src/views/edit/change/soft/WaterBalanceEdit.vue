<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="wb_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/wb">Water Balance</router-link>
			/ Edit
		</file-header>

		<regions-form is-update lum-lookup
			:item="item" :vars="vars" :init-items="initItems"
			:api-url="apiUrl"
			redirect-route="SoftCalibrationWaterBalanceEdit" />
	</project-container>
</template>

<script>
import RegionsForm from './RegionsForm';

export default {
	name: 'SoftCalibrationWaterBalanceEdit',
	components: {
		RegionsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			apiUrl: 'change/soft/regions/wb',
			item: {},
			vars: [],
			initItems: []
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

				const response2 = await this.$http.get(`vars/water_balance_sft/${this.appPath}`);
				this.vars = response2.data;

				//For some reason, this wasn't loading correctly just setting the array to = this.items.conditions; iterating and making a copy fixes it
				if (this.item.items) {
					for (let item of this.item.items) {
						this.initItems.push(item);
					}
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>