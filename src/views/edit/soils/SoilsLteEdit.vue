<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="soils_lte.sol" docs-path="soils">
			<router-link to="/edit/soils-lte">Soil Textures</router-link>
			/ Edit
		</file-header>

		<edit-form show-range is-update allow-bulk-edit
			:item="item"
			name="Soils" table="soil_lte" no-gis
			:vars="vars" 
			api-url="soils-lte"
			redirect-route="SoilNutrients" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'SoilsLteEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'soils-lte',
				vars: 'soils_lte_sol'
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