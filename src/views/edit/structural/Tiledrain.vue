<template>
	<project-container>
		<div v-if="$route.name == 'TiledrainStr'">
			<file-header input-file="tiledrain.str" docs-path="structural">
				Tile Drains
			</file-header>

			<grid-view 
				api-url="structural/tiledrain"
				collection-description="Tile Drains"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="tiledrain.csv" table-name="tiledrain_str" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'TiledrainStr'
}
</script>
