<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="dr_om.del" docs-path="connections/delivery-ratio">
			<router-link to="/edit/dr">Delivery Ratio</router-link> / 
			<router-link to="/edit/dr/om">Organic Mineral</router-link>
			/ Create
		</file-header>

		<edit-form 
			:item="item" 
			:vars="vars" 
			api-url="dr/om"
			redirect-route="DelratioOM" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'DelratioOMCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'dr_om_del'
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