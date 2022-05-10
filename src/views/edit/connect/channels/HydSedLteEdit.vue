<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="hyd-sed-lte.cha" docs-path="connections/channels">
			<router-link to="/edit/channels">Channels</router-link> / 
			<router-link to="/edit/channels/hydsed">Hydrology &amp; Sediment</router-link>
			/ Edit
		</file-header>

		<edit-form show-description is-update get-datasets-record allow-bulk-edit
			name="Channels" table="hyd_sed_lte_cha"
			:item="item"
			:vars="vars" 
			api-url="channels-lte/hydsed"
			redirect-route="ChannelsHydSedLte" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ChannelsHydSedLteEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'channels-lte/hydsed',
				vars: 'hyd_sed_lte_cha'
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