<template>
	<project-container>
		<file-header input-file="ch_sed_budget.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/chsed">Channel Sediment Budget</router-link>
			/ Create
		</file-header>

		<regions-form
			:item="item" :init-items="[]" :vars="[]"
			:api-url="apiUrl"
			redirect-route="SoftCalibrationChsedBudgetEdit" />
	</project-container>
</template>

<script>
import RegionsForm from './RegionsForm';

export default {
	name: 'SoftCalibrationChsedBudgetCreate',
	components: {
		RegionsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/regions/chsed',
			item: {}
		}
	}
}
</script>