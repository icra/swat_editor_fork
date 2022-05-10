<template>
	<project-container>
		<div v-if="$route.name == 'SoilsLte'">
			<file-header input-file="soils_lte.sol" docs-path="soils">
				Soil Textures
			</file-header>

			<grid-view 
				api-url="soils-lte"
				collection-description="soils"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="soils_lte.csv" table-name="soil_lte" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SoilsLte'
}
</script>
