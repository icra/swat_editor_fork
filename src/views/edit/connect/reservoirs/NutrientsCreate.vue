<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="nutrients.res" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/nutrients">Nutrients</router-link>
			/ Create
		</file-header>

		<edit-form show-range
			:item="item" 
			:vars="vars" 
			api-url="reservoirs/nutrients"
			redirect-route="ReservoirsNutrients" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ReservoirsNutrientsCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'nutrients_res'
			},
			page: {
				loading: true,
				error: null
			},
			item: {
				name: null,
				description: null
			},
			vars: []
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
				const response = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
                this.vars = response.data;
                this.item = this.setVars(this.item, this.vars);
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>