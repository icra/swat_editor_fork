<template>
	<project-container>
		<file-header input-file="wb_parms.sft" docs-path="change-calibration">
			<router-link to="/edit/change/soft">Soft Calibration</router-link>
			/ <router-link to="/edit/change/soft/wbparms">Water Balance Parameters</router-link>
			/ Create
		</file-header>

		<parms-form
			:item="item"  
			:api-url="apiUrl"
			:parm-list="['cn2', 'esco', 'latq_co', 'k_lo', 'slope', 'tconc', 'etco', 'perco', 'revapc', 'cn3_swf']"
			redirect-route="SoftCalibrationWbParms" />
	</project-container>
</template>

<script>
import ParmsForm from './ParmsForm';

export default {
	name: 'SoftCalibrationWbParmsCreate',
	components: {
		ParmsForm
	},
	data() {
		return {
			apiUrl: 'change/soft/parms/wb',
			item: {}
		}
	}
}
</script>