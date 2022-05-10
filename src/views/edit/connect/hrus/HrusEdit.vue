<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="hru.con" docs-path="connections/hrus">
			<router-link to="/edit/hrus">HRUs</router-link>
			/ Edit
		</file-header>

		<hrus-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit></hrus-form>
	</project-container>
</template>

<script>
import HrusForm from './HrusForm.vue';

export default {
	name: 'HrusEdit',
	components: {
		HrusForm
	},
	data() {
		return {
			apiUrl: 'hrus',
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

				const response2 = await this.$http.get(`${this.apiUrl}/properties/${response.data.hru.id}/${this.projectDbUrl}`);
				this.log(response2.data);

				this.item.props = {
					id: response2.data.id,
					name: response2.data.name,
					topo_name: this.setToNameProp(response2.data.topo),
					hyd_name: this.setToNameProp(response2.data.hydro),
					soil_name: this.setToNameProp(response2.data.soil),
					lu_mgt_name: this.setToNameProp(response2.data.lu_mgt),
					soil_plant_init_name: this.setToNameProp(response2.data.soil_plant_init),
					surf_stor: this.setToNameProp(response2.data.surf_stor),
					snow_name: this.setToNameProp(response2.data.snow),
					field_name: this.setToNameProp(response2.data.field),
					description: response2.data.description
				};

				this.log(this.item);
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>