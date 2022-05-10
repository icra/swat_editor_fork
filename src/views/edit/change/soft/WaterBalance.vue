<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationWaterBalance'">
			<file-header input-file="water_balance.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Water Balance
			</file-header>

			<grid-view 
				api-url="change/soft/regions/wb"
				use-filter use-action-bar
				collection-description="water balance regions"
				default-sort="name"
				use-dynamic-fields />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationWaterBalance'
}
</script>