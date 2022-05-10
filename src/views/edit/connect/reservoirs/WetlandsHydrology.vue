<template>
	<project-container>
		<div v-if="$route.name == 'ReservoirsWetlandsHydrology'">
			<file-header input-file="hydrology.wet" docs-path="connections/reservoirs">
				<router-link to="/edit/reservoirs">Reservoirs</router-link> 
				/ Wetlands Hydrology
			</file-header>

			<grid-view 
				api-url="reservoirs/wetlands_hydrology"
				collection-description="wetland hydrology properties"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="hydrology-wet.csv" table-name="hyd_wet" />
			
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ReservoirsWetlandsHydrology'
}
</script>
