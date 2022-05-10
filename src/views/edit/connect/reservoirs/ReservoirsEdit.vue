<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="reservoir.con" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link>
			/ Edit
		</file-header>

		<reservoirs-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit></reservoirs-form>
	</project-container>
</template>

<script>
import ReservoirsForm from './ReservoirsForm.vue';

export default {
	name: 'ReservoirsEdit',
	components: {
		ReservoirsForm
	},
	data() {
		return {
			apiUrl: 'reservoirs',
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
					wst_name: response.data.wst != null ? response.data.wst.name : ''
				};

				this.item.outflow = response.data.con_outs;

				const response2 = await this.$http.get(`${this.apiUrl}/properties/${response.data.res.id}/${this.projectDbUrl}`);

				this.item.props = {
					id: response2.data.id,
					name: response2.data.name,
					init_name: this.setToNameProp(response2.data.init),
					rel_name: this.setToNameProp(response2.data.rel),
					hyd_name: this.setToNameProp(response2.data.hyd),
					sed_name: this.setToNameProp(response2.data.sed),
					nut_name: this.setToNameProp(response2.data.nut),
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