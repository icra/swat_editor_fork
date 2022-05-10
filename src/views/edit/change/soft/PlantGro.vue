<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationPlantGro'">
			<file-header input-file="plant_gro.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Plant Growth
			</file-header>

			<grid-view 
				api-url="change/soft/regions/plant"
				use-filter use-action-bar
				collection-description="plant regions"
				default-sort="name"
				use-dynamic-fields />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationPlantGro'
}
</script>