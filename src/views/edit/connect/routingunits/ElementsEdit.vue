<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="rout_unit.ele" docs-path="connections/routing-units">
			<router-link to="/edit/routing_unit">Routing Units</router-link> / 
			<router-link to="/edit/routing_unit/elements">Elements</router-link>
			/ Edit
		</file-header>

		<elements-form is-update :item="item" :obj-types="objTypes" />
	</project-container>
</template>

<script>
import ElementsForm from './ElementsForm';

export default {
	name: 'RoutingUnitElementsEdit',
	components: {
		ElementsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			item: {},
			objTypes: []
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
				const response = await this.$http.get(`routing_unit/elements/${this.$route.params.id}/${this.projectDbUrl}`);
				this.item = response.data;
				this.item.rtu_name = response.data.rtu != null ? response.data.rtu.name : '';
				this.item.dlr_name = response.data.dlr != null ? response.data.dlr.name : '';

				const response2 = await this.$http.get(`codes/connect/obj_typ/${this.appPath}`);
				this.objTypes = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>