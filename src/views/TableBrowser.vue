<template>
	<div>
		<page-loading :loading="page.loading"></page-loading>
		<div v-if="!page.loading">
			<h1 class="mb-2">
				{{$route.query.section}}
			</h1>

			<grid-view 
				:api-url="$route.query.apiUrl" 
				hide-edit hide-create hide-delete show-name-and-description-first :default-per-page="100"
				collection-description="plants"
				use-filter
				default-sort="name"
				use-dynamic-fields />
		</div>
	</div>
</template>

<script>
export default {
	name: 'TableBrowser',
	data() {
		return {
			page: {
				loading: false,
				error: null
			}
		}
	},
	async created() {
		await this.init();
	},
	methods: {
		async init() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`setup/check-config/${this.$route.query.projectDb}`);
				this.log(response.data);

				let data = response.data;
				let project = {
					projectDb: this.$route.query.projectDb,
					datasetsDb: data.reference_db,
					name: data.project_name,
					description: data.project_description,
					version: data.editor_version,
					isLte: data.is_lte
				};

				this.$store.commit('setCurrentProject', project);
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to load data.');
			}
			
            this.page.loading = false;
		}
	}
}
</script>
