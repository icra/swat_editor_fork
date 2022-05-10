<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="parameters.bsn" docs-path="basin">
			Basin Parameters
		</file-header>

		<edit-form show-description show-range is-update hide-name no-id hide-copy
			:item="item" 
			:vars="vars" 
			api-url="basin/parameters"
			redirect-route="BasinParameters" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'BasinParameters',
	components: {
		EditForm
	},
	data() {
		return {
			page: {
				loading: true,
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
				const response = await this.$http.get(`basin/parameters/${this.projectDbUrl}`);
				this.item = response.data;

				const response2 = await this.$http.get(`vars/parameters_bsn/${this.appPath}`);
				this.vars = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get basin information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>