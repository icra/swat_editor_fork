<template>
	<project-container>
		<div v-if="$route.name == 'HardCalibration'">
			<file-header input-file="calibration.cal" docs-path="change-calibration">
				Hard Calibration
			</file-header>

			<grid-view 
				api-url="change/calibration"
				use-filter use-action-bar
				collection-description="calibrations"
				default-sort="id"
				use-dynamic-fields :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'HardCalibration',
	data () {
		return {
			routerLinkFields: [
				{ key: 'cal_parm', route: '/edit/change/hard/parms/edit/' }
			]
		}
	}
}
</script>