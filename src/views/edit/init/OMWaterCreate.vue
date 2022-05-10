<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="om_water.ini" docs-path="initialization-data">
			<router-link to="/edit/init/om_water">Organic Mineral Water</router-link>
			/ Create
		</file-header>

		<edit-form show-range
			:item="item" 
			:vars="vars" 
			api-url="/om_water"
			redirect-route="InitOMWater" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'InitOMWaterCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'om_water_ini'
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