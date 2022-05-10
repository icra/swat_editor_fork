<template>
	<project-container>
		<file-header input-file="ls_unit.def" docs-path="regions">
			<router-link to="/edit/regions/ls_units">Landscape Units</router-link>
			/ Create
		</file-header>

		<landscape-units-form :item="item" />
	</project-container>
</template>

<script>
import LandscapeUnitsForm from './LandscapeUnitsForm';

export default {
	name: 'LandscapeUnitsCreate',
	components: {
		LandscapeUnitsForm
	},
	data() {
		return {
			item: {
				name: null,
				area: 0
			}
		}
	}
}
</script>