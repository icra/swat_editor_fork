<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="exco.con" docs-path="connections/export-coefficients">
			<router-link to="/edit/exco">Export Coefficients</router-link>
			/ Edit
		</file-header>

		<exco-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit></exco-form>
	</project-container>
</template>

<script>
import ExcoForm from './ExcoForm.vue';

export default {
	name: 'ExcoEdit',
	components: {
		ExcoForm
	},
	data() {
		return {
			apiUrl: 'exco',
			page: {
				loading: false,
				error: null
			},
			item: {
				connect: {},
				props: {},
				outflow: []
			}
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

				const response2 = await this.$http.get(`${this.apiUrl}/properties/${response.data.exco.id}/${this.projectDbUrl}`);

				this.item.props = {
					id: response2.data.id,
					name: response2.data.name,
					om_name: this.setToNameProp(response2.data.om),
					pest_name: this.setToNameProp(response2.data.pest),
					path_name: this.setToNameProp(response2.data.path),
					hmet_name: this.setToNameProp(response2.data.hmet),
					salt_name: this.setToNameProp(response2.data.salt),
					description: response2.data.description
				};
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script> 