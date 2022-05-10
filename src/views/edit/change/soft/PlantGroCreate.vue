<template>
	<project-container>
		<file-header input-file="plant_gro.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/plant">Plant Growth</router-link>
			/ Create
		</file-header>

		<regions-form lum-lookup
			:item="item" :init-items="[]" :vars="[]"
			:api-url="apiUrl"
			redirect-route="SoftCalibrationPlantGroEdit" />
	</project-container>
</template>

<script>
import RegionsForm from './RegionsForm';

export default {
	name: 'SoftCalibrationPlantGroCreate',
	components: {
		RegionsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/regions/plant',
			item: {}
		}
	}
}
</script>