<template>
	<project-container>
		<file-header input-file="hydrology.res" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/hydrology">Hydrology</router-link>
			/ Create
		</file-header>

		<edit-form show-range
			:item="item" 
			:vars="vars" 
			api-url="reservoirs/hydrology"
			redirect-route="ReservoirsHydrology" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ReservoirsHydrologyCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'hydrology_res'
			},
			page: {
				loading: true,
				error: null
			},
			item: {
				name: null
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