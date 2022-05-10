<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="rout_unit.con" docs-path="connections/routing-units">
			<router-link to="/edit/routing_unit">Routing Units</router-link>
			/ Edit
		</file-header>

		<routing-unit-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit></routing-unit-form>
	</project-container>
</template>

<script>
import RoutingUnitForm from './RoutingUnitForm.vue';

export default {
	name: 'RoutingUnitEdit',
	components: {
		RoutingUnitForm
	},
	data() {
		return {
			apiUrl: 'routing_unit',
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

				const response2 = await this.$http.get(`${this.apiUrl}/properties/${response.data.rtu.id}/${this.projectDbUrl}`);

				this.item.props = {
					id: response2.data.id,
					name: response2.data.name,
					topo_name: this.setToNameProp(response2.data.topo),
					dlr_name: this.setToNameProp(response2.data.dlr),
					field_name: this.setToNameProp(response2.data.field),
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