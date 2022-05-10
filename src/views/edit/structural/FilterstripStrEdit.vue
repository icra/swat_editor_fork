<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="filterstrip.str" docs-path="structural">
			<router-link to="/edit/structural/filterstrip">Filter Strips</router-link>
			/ Edit
		</file-header>

		<edit-form show-description show-range is-update get-datasets-record allow-bulk-edit
			:item="item"
			name="Structures" table="filterstrip_str" no-gis
			:vars="vars" 
			api-url="structural/filterstrip"
			redirect-route="FilterstripStr" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'FilterstripStrEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'structural/filterstrip',
				vars: 'filterstrip_str'
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