<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="dr_om.del" docs-path="connections/delivery-ratio">
			<router-link to="/edit/dr">Delivery Ratio</router-link> / 
			<router-link to="/edit/dr/om">Organic Mineral</router-link>
			/ Edit
		</file-header>

		<edit-form is-update allow-bulk-edit
			:item="item" 
			name="Objects" table="om_del" no-gis
			:vars="vars" 
			api-url="dr/om"
			redirect-route="DelratioOM" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'DelratioOMEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'dr/om',
				vars: 'dr_om_del'
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