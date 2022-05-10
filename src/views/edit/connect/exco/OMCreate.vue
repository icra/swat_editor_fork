<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="exco_om.exc" docs-path="connections/export-coefficients">
			<router-link to="/edit/exco">Export Coefficients</router-link> / 
			<router-link to="/edit/exco/om">Organic Mineral</router-link>
			/ Create
		</file-header>

		<edit-form 
			:item="item" 
			:vars="vars" 
			api-url="exco/om"
			redirect-route="ExcoOM" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ExcoOMCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'exco_om_exc'
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