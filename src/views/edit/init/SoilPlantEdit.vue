<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="soil_plant.ini" docs-path="initialization-data">
			<router-link to="/edit/init/soil_plant">Soil Plant</router-link>
			/ Edit
		</file-header>

		<soil-plant-form is-update :item="item" :item-list="items" allow-bulk-edit />
	</project-container>
</template>

<script>
import SoilPlantForm from './SoilPlantForm';

export default {
	name: 'InitSoilPlantEdit',
	components: {
		SoilPlantForm
	},
	data() {
		return {
			page: {
				loading: true,
				error: null
			},
			item: {},
			items: []
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
				const response = await this.$http.get(`/soil_plant/${this.$route.params.id}/${this.projectDbUrl}`);
				var data = response.data;

				this.item = {
					id: data.id,
					name: data.name,
					sw_frac: data.sw_frac,
					nutrients_name: data.nutrients != null ? data.nutrients.name : null,
					pest_name: data.pest != null ? data.pest.name : null,
					path_name: data.path != null ? data.path.name : null,
					hmet_name: data.hmet != null ? data.hmet.name : null,
					salt_name: data.salt != null ? data.salt.name : null
				};

				const response2 = await this.$http.get(`/soil_plant/many/${this.projectDbUrl}`);
				this.items = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>