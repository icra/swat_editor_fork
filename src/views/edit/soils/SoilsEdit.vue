<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="soils.sol" docs-path="soils">
			<router-link to="/edit/soils">Soils</router-link>
			/ Edit
		</file-header>

		<soils-form is-update :item="item" :vars="vars" />
	</project-container>
</template>

<script>
import SoilsForm from './SoilsForm';

export default {
	name: 'SoilsEdit',
	components: {
		SoilsForm
	},
	data() {
		return {
			paths: {
				data: 'soils',
				vars: 'soils_sol_layer'
			},
			page: {
				loading: false,
				error: null
			},
			item: {},
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
				const response = await this.$http.get(`${this.paths.data}/${this.$route.params.id}/${this.projectDbUrl}`);
				this.item = response.data;

				const response2 = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
				this.vars = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>