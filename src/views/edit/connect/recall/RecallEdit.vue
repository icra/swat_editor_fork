<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<div v-if="$route.name == 'RecallEdit'">
			<file-header input-file="recall.con" docs-path="connections/recall">
				<router-link to="/edit/recall">Point Source</router-link>
				/ Edit
			</file-header>

			<recall-form :item="item" :api-url="apiUrl" is-update allow-bulk-edit></recall-form>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import RecallForm from './RecallForm.vue';

export default {
	name: 'RecallEdit',
	components: {
		RecallForm
	},
	data() {
		return {
			apiUrl: 'recall',
			page: {
				loading: false,
				error: null
			},
			item: {
				connect: {},
				props: {},
				outflow: []
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		getRecTypDescription(rec_typ) {
			switch (rec_typ) {
				case 1: return 'Daily';
				case 2: return 'Monthly';
				case 3: return 'Yearly';
				default: return 'Constant';
			}
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`${this.apiUrl}/${this.$route.params.id}/${this.projectDbUrl}`);
				this.log(response.data);

				this.item.connect = {
					id: response.data.id,
					name: response.data.name,
					area: response.data.area,
					lat: response.data.lat,
					lon: response.data.lon,
					elev: response.data.elev,
					wst_name: response.data.wst != null ? response.data.wst.name : ''
				};

				this.item.outflow = response.data.con_outs;

				const response2 = await this.$http.get(`${this.apiUrl}/data/${response.data.rec.id}/${this.projectDbUrl}`);

				this.item.props = {
					id: response2.data.id,
					name: response2.data.name,
					rec_typ: response2.data.rec_typ
				};
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script> 