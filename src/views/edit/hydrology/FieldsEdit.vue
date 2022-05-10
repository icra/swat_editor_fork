<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="field.fld" docs-path="hydrology">
			<router-link to="/edit/fields">Fields</router-link>
			/ Edit
		</file-header>

		<edit-form is-update allow-bulk-edit
			:item="item"
			name="Fields" table="fld" 
			:vars="vars" 
			api-url="fields"
			redirect-route="Fields" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'FieldsEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'fields',
				vars: 'field_fld'
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