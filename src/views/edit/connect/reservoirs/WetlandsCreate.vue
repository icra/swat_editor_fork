<template>
	<project-container>
		<file-header input-file="wetland.wet" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link> / 
			<router-link to="/edit/reservoirs/wetlands">Wetlands</router-link>
			/ Create
		</file-header>

		<wetlands-form :item="item" />
	</project-container>
</template>

<script>
import WetlandsForm from './WetlandsForm'

export default {
	name: 'ReservoirsWetlandsCreate',
	components: {
		WetlandsForm
	},
	data() {
		return {
			item: {
				id: null,
				name: null,
				init_name: null,
				rel_name: null,
				hyd_name: null,
				sed_name: null,
				nut_name: null,
				description: null
			}
		}
	}
}
</script>