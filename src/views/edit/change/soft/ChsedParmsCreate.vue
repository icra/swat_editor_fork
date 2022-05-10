<template>
	<project-container>
		<file-header input-file="ch_sed_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/chsedparms">Channel Parameters</router-link>
			/ Create
		</file-header>

		<parms-form
			:item="item"  
			:api-url="apiUrl"
			:parm-list="['cov', 'erod', 'shear_bnk', 'hc_erod']"
			redirect-route="SoftCalibrationChsedParms" />
	</project-container>
</template>

<script>
import ParmsForm from './ParmsForm';

export default {
	name: 'SoftCalibrationChsedParmsCreate',
	components: {
		ParmsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/parms/chsed',
			item: {}
		}
	}
}
</script>