<template>
	<project-container>
		<file-header input-file="plant_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/plantparms">Plant Parameters</router-link>
			/ Create
		</file-header>

		<regions-form
			:item="item" :init-items="[]" :vars="[]"
			:api-url="apiUrl"
			redirect-route="SoftCalibrationPlantParmsEdit" />
	</project-container>
</template>

<script>
import RegionsForm from './RegionsForm';

export default {
	name: 'SoftCalibrationPlantParmsCreate',
	components: {
		RegionsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/parms/plant',
			item: {}
		}
	}
}
</script>