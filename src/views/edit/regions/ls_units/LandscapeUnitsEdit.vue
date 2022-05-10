<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="ls_unit.def" docs-path="regions">
			<router-link to="/edit/regions/ls_units">Landscape Units</router-link>
			/ Edit
		</file-header>

		<landscape-units-form is-update :item="item" />
	</project-container>
</template>

<script>
import LandscapeUnitsForm from './LandscapeUnitsForm';

export default {
	name: 'LandscapeUnitsEdit',
	components: {
		LandscapeUnitsForm
	},
	data() {
		return {
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
				const response = await this.$http.get(`ls_units/${this.$route.params.id}/${this.projectDbUrl}`);
				this.item = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>