<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="weather-wgn.cli" docs-path="climate">
			<router-link to="/edit/wgn">Weather Generator</router-link>
			/ Create
		</file-header>

		<wgn-form :wgn="wgn" />
	</project-container>
</template>

<script>
import WgnForm from './WgnForm';

export default {
	name: 'WgnCreate',
	components: {
		WgnForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			wgn: {
				name: null,
				lat: null,
				lon: null,
				elev: null,
				rain_yrs: null,
                monthly_values: []
            }
		}
	}
}
</script>