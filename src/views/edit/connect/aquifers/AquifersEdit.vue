<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="aquifer.con" docs-path="connections/aquifers">
			<router-link to="/edit/aquifers">Aquifers</router-link>
			/ Edit
		</file-header>

		<aquifers-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit :vars="vars"></aquifers-form>
	</project-container>
</template>

<script>
import AquifersForm from './AquifersForm.vue';

export default {
	name: 'AquifersEdit',
	components: {
		AquifersForm
	},
	data() {
		return {
			apiUrl: 'aquifers',
			paths: {
				vars: 'aquifer_aqu'
			},
			page: {
				loading: false,
				error: null
			},
			item: {
				connect: {},
				props: {},
				outflow: []
			},
			vars: []
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
				this.log(response.data);

				this.item.connect = {
					id: response.data.id,
					name: response.data.name,
					area: response.data.area,
					lat: response.data.lat,
					lon: response.data.lon,
					elev: response.data.elev,
					wst_name: this.setToNameProp(response.data.wst)
				};

				this.item.outflow = response.data.con_outs;

				const response2 = await this.$http.get(`${this.apiUrl}/properties/${response.data.aqu.id}/${this.projectDbUrl}`);
				this.item.props = response2.data;

				const response3 = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
				this.vars = response3.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script> 