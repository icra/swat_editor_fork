<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="initial.cha" docs-path="connections/channels">
			<router-link to="/edit/channels">Channels</router-link> / 
			<router-link to="/edit/channels/initial">Initial</router-link>
			/ Edit
		</file-header>

		<initial-form is-update :item="channel" />
	</project-container>
</template>

<script>
import InitialForm from './InitialForm';

export default {
	name: 'ChannelsInitialEdit',
	components: {
		InitialForm
	},
	data() {
		return {
			page: {
				loading: true,
				error: undefined,
				validated: false,
				saving: false
			},
			channel: {}
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
				const response = await this.$http.get(`channels/initial/${this.$route.params.id}/${this.projectDbUrl}`);
				let data = response.data;

				this.channel = {
					id: data.id,
					name: data.name,
					org_min_name: data.org_min != null ? data.org_min.name : '',
					pest_name: data.pest != null ? data.pest.name : '',
					path_name: data.path != null ? data.path.name : '',
					hmet_name: data.hmet != null ? data.hmet.name : '',
					salt_name: data.salt != null ? data.salt.name : '',
					description: data.description
				};
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get channel properties from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>