<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="weather-sta.cli" docs-path="climate">
			<router-link to="/edit/stations">Weather Stations</router-link>
			/ Create
		</file-header>

		<stations-form :station="station" />
	</project-container>
</template>

<script>
import StationsForm from './StationsForm';

export default {
	name: 'StationsCreate',
	components: {
		StationsForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			station: {
				name: null,
				lat: null,
				lon: null,
				wgn: null,
				pcp: 'sim',
				tmp: 'sim',
				slr: 'sim',
				hmd: 'sim',
				wnd: 'sim',
				wnd_dir: null,
				atmo_dep: null
			}
		}
	}
}
</script>