<template>
	<project-container>
		<div v-if="$route.name == 'Plants'">
			<file-header input-file="plants.plt" docs-path="databases">
				Plants
			</file-header>

			<grid-view 
				api-url="db/plants"
				collection-description="plants"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="plants.csv" table-name="plant" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Plants'
}
</script>
