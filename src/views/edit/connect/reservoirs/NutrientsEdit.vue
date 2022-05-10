<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="nutrients.res" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/nutrients">Nutrients</router-link>
			/ Edit
		</file-header>

		<edit-form show-range is-update allow-bulk-edit
			name="Reservoirs" table="nut_res"
			:item="item" 
			:vars="vars" 
			api-url="reservoirs/nutrients"
			redirect-route="ReservoirsNutrients" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ReservoirsNutrientsEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'reservoirs/nutrients',
				vars: 'nutrients_res'
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