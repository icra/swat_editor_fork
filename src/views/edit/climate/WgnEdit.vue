<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="weather-wgn.cli" docs-path="climate">
			<router-link to="/edit/wgn">Weather Generator</router-link>
			/ Edit
		</file-header>

		<wgn-form is-update :wgn="wgn" />
	</project-container>
</template>

<script>
import WgnForm from './WgnForm';

export default {
	name: 'WgnEdit',
	components: {
		WgnForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			wgn: {}
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
				const response = await this.$http.get(`climate/wgn/${this.$route.params.id}/${this.projectDbUrl}`);
				this.wgn = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get wgn from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>