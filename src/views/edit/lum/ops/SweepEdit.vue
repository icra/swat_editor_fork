<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="sweep.ops" docs-path="land-use-management#sweep">
			<router-link to="/edit/lum/ops">Operations</router-link> 
			/ <router-link to="/edit/lum/ops/sweep">Sweep</router-link> 
			/ Edit
		</file-header>

		<edit-form show-description show-range is-update get-datasets-record allow-bulk-edit
			:item="item"
			name="Operations" table="sweep_ops" no-gis
			:vars="vars" 
			api-url="ops/sweep"
			redirect-route="OperationsSweep" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'OperationsSweepEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'ops/sweep',
				vars: 'sweep_ops'
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