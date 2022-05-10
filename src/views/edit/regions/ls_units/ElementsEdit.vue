<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="ls_unit.ele" docs-path="regions">
			<router-link to="/edit/regions/ls_units">Landscape Units</router-link> /
			<router-link to="/edit/regions/ls_units/elements">Elements</router-link>
			/ Edit
		</file-header>

		<elements-form is-update :item="item" :obj-types="objTypes" />
	</project-container>
</template>

<script>
import ElementsForm from './ElementsForm';

export default {
	name: 'LandscapeUnitsElementsEdit',
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
				const response = await this.$http.get(`ls_units/elements/${this.$route.params.id}/${this.projectDbUrl}`);
				this.item = response.data;
				this.item.ls_unit_def_name = response.data.ls_unit_def !== null ? response.data.ls_unit_def.name : null;

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