<template>
	<project-container>
		<div v-if="$route.name == 'SoftCalibrationChsedParms'">
			<file-header input-file="ch_sed_parms.sft" docs-path="change-calibration">
				<router-link to="/edit/change/soft">Soft Calibration</router-link>
				/ Channel Parameters
			</file-header>

			<grid-view 
				api-url="change/soft/parms/chsed"
				use-filter use-action-bar
				collection-description="channel parameters"
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="ch_sed_parms_sft.csv" table-name="chsed_parms_sft" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoftCalibrationChsedParms'
}
</script>