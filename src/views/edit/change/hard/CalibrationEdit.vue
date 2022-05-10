<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="calibration.cal" docs-path="change-calibration">
			<router-link to="/edit/change/hard">Hard Calibration</router-link>
			/ Edit
		</file-header>

		<calibration-form is-update :item="item" :obj-options="objOptions" :init-objs="initObjs" :init-conds="initConds" />
	</project-container>
</template>

<script>
import CalibrationForm from './CalibrationForm';

export default {
	name: 'HardCalibrationEdit',
	components: {
		CalibrationForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			item: {},
			objOptions: [],
			initObjs: [],
			initConds: []
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
				const response = await this.$http.get(`change/calibration/${this.$route.params.id}/${this.projectDbUrl}`);
				this.item = response.data.item;
				this.objOptions = response.data.obj_options;
				this.item.cal_parm_name = this.item.cal_parm != null ? this.item.cal_parm.name : '';

				if (this.item.elements) {
					for (let i = 0; i < this.item.elements.length; i++) {
						this.initObjs.push(this.item.elements[i].obj_id);
					}
				}

				//For some reason, this wasn't loading correctly just setting the array to = this.items.conditions; iterating and making a copy fixes it
				if (this.item.conditions) {
					for (let i = 0; i < this.item.conditions.length; i++) {
						this.initConds.push(this.item.conditions[i]);
					}
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>