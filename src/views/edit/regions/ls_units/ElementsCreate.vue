<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="ls_unit.ele" docs-path="regions">
			<router-link to="/edit/regions/ls_units">Landscape Units</router-link> /
			<router-link to="/edit/regions/ls_units/elements">Elements</router-link>
			/ Create
		</file-header>

		<elements-form :item="item" :obj-types="objTypes" />
	</project-container>
</template>

<script>
import ElementsForm from './ElementsForm';

export default {
	name: 'LandscapeUnitsElementsCreate',
	components: {
		ElementsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			item: {
				obj_typ: 'hru',
				bsn_frac: 0,
				sub_frac: 0,
				reg_frac: 0
			},
			objTypes: []
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
				const response = await this.$http.get(`codes/connect/obj_typ/${this.appPath}`);
				this.objTypes = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get landscape unit from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>