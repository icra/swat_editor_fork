<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="weather-sta.cli" docs-path="climate">
			<router-link to="/edit/stations">Weather Stations</router-link>
			/ Edit
		</file-header>

		<stations-form is-update :station="station" />
	</project-container>
</template>

<script>
import StationsForm from './StationsForm';

export default {
	name: 'StationsEdit',
	components: {
		StationsForm
	},
	data() {
		return {
			page: {
				loading: true,
				error: null
			},
			station: {}
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
				const response = await this.$http.get(`climate/stations/${this.$route.params.id}/${this.projectDbUrl}`);
				this.station = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get station from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>