<template>
	<project-container>
		<div v-if="$route.name == 'Snow'">
			<file-header input-file="snow.sno" docs-path="databases">
				Snow
			</file-header>

			<grid-view 
				api-url="db/snow"
				collection-description="snow"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="snow.csv" table-name="snow" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Snow'
}
</script>
