<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="hyd-sed-lte.cha" docs-path="connections/channels">
			<router-link to="/edit/channels">Channels</router-link> / 
			<router-link to="/edit/channels/hydsed">Hydrology &amp; Sediment</router-link>
			/ Create
		</file-header>

		<edit-form show-description 
			:item="item" 
			:vars="vars" 
			api-url="channels-lte/hydsed"
			redirect-route="ChannelsHydSedLte" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'ChannelsHydSedLteCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'hyd_sed_lte_cha'
			},
			page: {
				loading: true,
				error: null
			},
			item: {
				name: null,
				description: null
			},
			vars: []
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
                this.vars = response.data;
                
                let keys = Object.keys(this.vars);
                for (let k of keys) {
					let v = this.vars[k];
                    this.item[k] = v.type == 'string' ? v.default_text : v.default_value;
                }
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>