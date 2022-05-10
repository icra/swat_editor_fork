<template>
	<project-container>
		<div v-if="$route.name == 'SoilNutrients'">
			<file-header input-file="nutrients.sol" docs-path="soils">
				Soil Nutrients
			</file-header>

			<grid-view 
				api-url="soil-nutrients"
				collection-description="soil nutrients"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="nutrients_sol.csv" table-name="soil_nut" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoilNutrients'
}
</script>
