<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="rout_unit.ele" docs-path="connections/routing-units">
			<router-link to="/edit/routing_unit">Routing Units</router-link> / 
			<router-link to="/edit/routing_unit/elements">Elements</router-link>
			/ Create
		</file-header>

		<elements-form :item="item" :obj-types="objTypes" />
	</project-container>
</template>

<script>
import ElementsForm from './ElementsForm';

export default {
	name: 'RoutingUnitElementsCreate',
	components: {
		ElementsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			item: {
				obj_typ: 'hru',
				hyd_typ: 'tot',
				frac: 0
			},
			objTypes: []
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`codes/connect/obj_typ/${this.appPath}`);
				this.objTypes = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get landscape unit from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>