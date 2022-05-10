<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationChsedBudget'">
			<file-header input-file="ch_sed_budget.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Channel Sediment Budget
			</file-header>

			<grid-view 
				api-url="change/soft/regions/chsed"
				use-filter use-action-bar
				collection-description="channel regions"
				default-sort="name"
				use-dynamic-fields />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationChsedBudget'
}
</script>