<template>
	<project-container>
		<div v-if="$route.name == 'ReservoirsHydrology'">
			<file-header input-file="hydrology.res" docs-path="connections/reservoirs">
				<router-link to="/edit/reservoirs">Reservoirs</router-link> 
				/ Hydrology
			</file-header>

			<grid-view 
				api-url="reservoirs/hydrology"
				collection-description="reservoir hydrology properties"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="hydrology-res.csv" table-name="hyd_res" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ReservoirsHydrology'
}
</script>
