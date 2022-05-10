<template>
	<project-container>
		<file-header input-file="calibration.cal" docs-path="change-calibration">
			<router-link to="/edit/change/hard">Hard Calibration</router-link>
			/ Create
		</file-header>

		<calibration-form :item="item" :obj-options="objOptions" />
	</project-container>
</template>

<script>
import CalibrationForm from './CalibrationForm';

export default {
	name: 'HardCalibrationCreate',
	components: {
		CalibrationForm
	},
	data() {
		return {
			item: {
				chg_typ: 'absval'
			},
			objOptions: []
		}
	}
}
</script>