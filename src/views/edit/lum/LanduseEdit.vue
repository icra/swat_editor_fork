<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="landuse.lum" docs-path="land-use-management">
			<router-link to="/edit/lum/landuse">Land Use Management</router-link>
			/ Edit
		</file-header>

		<landuse-form is-update :item="item" allow-bulk-edit :item-list="items" />
	</project-container>
</template>

<script>
import LanduseForm from './LanduseForm';

export default {
	name: 'LanduseEdit',
	components: {
		LanduseForm
	},
	data() {
		return {
			paths: {
				data: 'landuse'
			},
			page: {
				loading: false,
				error: null
			},
			item: {},
			items: []
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
				let data = response.data;

				this.item = {
					id: data.id,
					name: data.name,
					cal_group: data.cal_group,
					urb_ro: data.urb_ro,
					plnt_com_name: data.plnt_com != null ? data.plnt_com.name : '',
					mgt_name: data.mgt != null ? data.mgt.name : '',
					cn2_name: data.cn2 != null ? data.cn2.name : '',
					cons_prac_name: data.cons_prac != null ? data.cons_prac.name : '',
					urban_name: data.urban != null ? data.urban.name : '',
					ov_mann_name: data.ov_mann != null ? data.ov_mann.name : '',
					tile_name: data.tile != null ? data.tile.name : '',
					sep_name: data.sep != null ? data.sep.name : '',
					vfs_name: data.vfs != null ? data.vfs.name : '',
					grww_name: data.grww != null ? data.grww.name : '',
					bmp_name: data.bmp != null ? data.bmp.name : '',
					description: data.description
				};

				const response2 = await this.$http.get(`${this.paths.data}/many/${this.projectDbUrl}`);
				this.items = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get land use properties from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>