<template>
	<project-container>
		<div v-if="$route.name == 'HardCalibrationParms'">
			<file-header input-file="cal_parms.cal" docs-path="change-calibration">
				<router-link to="/edit/change/hard">Hard Calibration</router-link>
				/ Parameters
			</file-header>

			<p>
				You cannot add new parameters because they are determined by the model; however, you may edit the 
				absolute minimum and maximum values by selecting a row below.
			</p>

			<grid-view 
				api-url="change/cal_parms"
				collection-description="calibration parameters"
				use-filter
				default-sort="obj_typ"
				use-dynamic-fields hide-create hide-delete />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'HardCalibrationParms'
}
</script>