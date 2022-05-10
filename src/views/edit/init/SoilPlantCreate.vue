<template>
	<project-container>
		<file-header input-file="soil_plant.ini" docs-path="initialization-data">
			<router-link to="/edit/init/soil_plant">Soil Plant</router-link>
			/ Create
		</file-header>

		<soil-plant-form :item="item" />
	</project-container>
</template>

<script>
import SoilPlantForm from './SoilPlantForm'

export default {
	name: 'InitSoilPlantCreate',
	components: {
		SoilPlantForm
	},
	data() {
		return {
			item: {
				id: null,
				name: null,
				sw_frac: 0,
				nutrients_name: null,
				pest_name: null,
				path_name: null,
				hmet_name: null,
				salt_name: null
			}
		}
	}
}
</script>