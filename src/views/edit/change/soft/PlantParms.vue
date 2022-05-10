<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationPlantParms'">
			<file-header input-file="plant_parms.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Plant Parameters
			</file-header>

			<grid-view 
				api-url="change/soft/parms/plant"
				use-filter use-action-bar
				collection-description="plant parameters"
				default-sort="name"
				use-dynamic-fields />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationPlantParms'
}
</script>