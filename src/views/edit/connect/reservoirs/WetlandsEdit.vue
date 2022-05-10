<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="wetland.wet" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/wetlands">Wetlands</router-link>
			/ Edit
		</file-header>

		<wetlands-form is-update :item="item" />
	</project-container>
</template>

<script>
import WetlandsForm from './WetlandsForm';

export default {
	name: 'ReservoirsWetlandsEdit',
	components: {
		WetlandsForm
	},
	data() {
		return {
			page: {
				loading: true,
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
		getDb: function() {
			return this.$http.get('reservoirs/wetlands/' + this.$route.params.id + '/' + this.project_db_url);
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

           try {
				const response = await this.$http.get(`reservoirs/wetlands/${this.$route.params.id}/${this.projectDbUrl}`);
				let data = response.data;

				this.item = {
					id: data.id,
					name: data.name,
					init_name: data.init != null ? data.init.name : '',
					rel_name: data.rel != null ? data.rel.name : '',
					hyd_name: data.hyd != null ? data.hyd.name : '',
					sed_name: data.sed != null ? data.sed.name : '',
					nut_name: data.nut != null ? data.nut.name : '',
					description: data.description
				};
			} catch (error) {				
				this.page.error = this.logError(error, 'Unable to get wetlands from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>