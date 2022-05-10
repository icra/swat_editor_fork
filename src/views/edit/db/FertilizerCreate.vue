<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="fertilizer.frt" docs-path="databases">
			<router-link to="/edit/db/fertilizer">Fertilizer</router-link>
			/ Create
		</file-header>

		<edit-form show-description show-range
			:item="item" 
			:vars="vars" 
			api-url="db/fertilizer"
			redirect-route="Fertilizer" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'FertilizerCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'fertilizer_frt'
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