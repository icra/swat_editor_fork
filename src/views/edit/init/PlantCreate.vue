<template>
	<project-container>
		<file-header input-file="plant.ini" docs-path="initialization-data">
			<router-link to="/edit/init/plant">Plant Communities</router-link>
			/ Create
		</file-header>

		<plant-form :item="item" />
	</project-container>
</template>

<script>
import PlantForm from './PlantForm';

export default {
	name: 'InitPlantCreate',
	components: {
		PlantForm
	},
	data: function() {
		return {
			item: {
				name: null,
				description: null,
				rot_yr_ini: 1
			}
		}
	}
}
</script>