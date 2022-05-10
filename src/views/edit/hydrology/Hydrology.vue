<template>
	<project-container>
		<div v-if="$route.name == 'Hydrology'">
			<file-header input-file="hydrology.hyd" docs-path="hydrology">
				Hydrology
			</file-header>
			
			<grid-view
				api-url="hydrology"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="hydrology.csv" table-name="hyd" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Hydrology'
}
</script>