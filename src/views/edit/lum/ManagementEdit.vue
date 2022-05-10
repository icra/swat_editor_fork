<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="management.sch" docs-path="land-use-management#management-schedules">
			<router-link to="/edit/lum/mgt">Management Schedules</router-link>
			/ Edit
		</file-header>

		<management-form is-update :item="item" />
	</project-container>
</template>

<script>
import ManagementForm from './ManagementForm';

export default {
	name: 'ManagementEdit',
	components: {
		ManagementForm
	},
	data() {
		return {
			paths: {
				data: 'mgt_sch'
			},
			page: {
				loading: false,
				error: null
			},
			item: {}
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
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get management schedule from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>