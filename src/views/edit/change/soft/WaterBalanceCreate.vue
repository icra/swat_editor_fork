<template>
	<project-container>
		<file-header input-file="water_balance.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/wb">Water Balance</router-link>
			/ Create
		</file-header>

		<regions-form
			:item="item" :init-items="[]" :vars="[]"
			:api-url="apiUrl"
			redirect-route="SoftCalibrationWaterBalanceEdit" />
	</project-container>
</template>

<script>
import RegionsForm from './RegionsForm';

export default {
	name: 'SoftCalibrationWaterBalanceCreate',
	components: {
		RegionsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/regions/wb',
			item: {}
		}
	}
}
</script>