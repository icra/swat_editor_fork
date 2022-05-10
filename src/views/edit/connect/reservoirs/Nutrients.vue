<template>
	<project-container>
		<div v-if="$route.name == 'ReservoirsNutrients'">
			<file-header input-file="nutrients.res" docs-path="connections/reservoirs">
				<router-link to="/edit/reservoirs">Reservoirs</router-link> 
				/ Nutrients
			</file-header>

			<grid-view 
				api-url="reservoirs/nutrients"
				collection-description="reservoir nutrients properties"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="nutrients-res.csv" table-name="nut_res" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ReservoirsNutrients'
}
</script>
