<!--//ICRA Adrià Riu -- Pollutants db edit view-->

<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="pollutants.pth" docs-path="databases">
			<router-link to="/edit/db/pollutants">Pollutants</router-link>
			/ Edit
		</file-header>

		<edit-form show-description show-range is-update get-datasets-record allow-bulk-edit
			:item="item"
			name="Pollutants" table="poll" no-gis
			:vars="vars"
			api-url="db/pollutants"
			redirect-route="Pollutants" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'PollutantsEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'db/pollutants',
				vars: 'pollutants_pth'
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

				console.log(this.item)
				console.log(this.vars)
				console.log(this.paths.vars)
				console.log(this.appPath)

			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}

			this.page.loading = false;
		}
	}
}
</script>
