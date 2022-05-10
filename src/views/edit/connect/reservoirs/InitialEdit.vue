<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="initial.res" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/initial">Initial</router-link>
			/ Edit
		</file-header>

		<initial-form is-update :item="item" />
	</project-container>
</template>

<script>
import InitialForm from './InitialForm';

export default {
	name: 'ReservoirsInitialEdit',
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
				const response = await this.$http.get(`reservoirs/initial/${this.$route.params.id}/${this.projectDbUrl}`);
				let data = response.data;

				this.item = {
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
				this.page.error = this.logError(error, 'Unable to get reservoir properties from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>