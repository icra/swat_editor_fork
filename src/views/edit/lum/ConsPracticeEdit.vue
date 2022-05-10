<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="cons_practice.lum" docs-path="land-use-management#conservation-practices">
			<router-link to="/edit/lum/conspractice">Conservation Practices</router-link>
			/ Edit
		</file-header>

		<edit-form show-description show-range is-update get-datasets-record allow-bulk-edit
			:item="item"
			name="Practices" table="cons_prac" no-gis
			:vars="vars" 
			api-url="cons_prac"
			redirect-route="ConsPractice" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ConsPracticeEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'cons_prac',
				vars: 'cons_practice_lum'
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