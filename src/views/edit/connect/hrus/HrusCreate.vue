<template>
	<project-container>
		<file-header input-file="hru.con" docs-path="connections/hrus">
			<router-link to="/edit/hrus">HRUs</router-link>
			/ Create
		</file-header>

		<hrus-form :item="item" :api-url="apiUrl"></hrus-form>
	</project-container>
</template>

<script>
import HrusForm from './HrusForm.vue';

export default {
	name: 'HrusCreate',
	components: {
		HrusForm
	},
	data() {
		return {
			apiUrl: 'hrus',
			item: {
				connect: {
					name: null,
					area: 0,
					lat: 0,
					lon: 0,
					elev: null,
					wst_name: null
				},
				props: {},
				outflow: []
			}
		}
	}
}
</script>