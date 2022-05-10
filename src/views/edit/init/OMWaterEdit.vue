<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="om_water.ini" docs-path="initialization-data">
			<router-link to="/edit/init/om_water">Organic Mineral Water</router-link>
			/ Edit
		</file-header>

		<edit-form show-range is-update allow-bulk-edit
			:item="item" 
			name="Objects" table="om_water_ini" no-gis
			:vars="vars" 
			api-url="/om_water"
			redirect-route="InitOMWater" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'InitOMWaterEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'om_water',
				vars: 'om_water_ini'
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