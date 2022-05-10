<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationWbParms'">
			<file-header input-file="wb_parms.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Water Balance Parameters
			</file-header>

			<grid-view 
				api-url="change/soft/parms/wb"
				use-filter use-action-bar
				collection-description="water balance parameters"
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="wb_parms_sft.csv" table-name="wb_parms_sft" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationWbParms'
}
</script>