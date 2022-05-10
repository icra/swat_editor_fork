<template>
	<project-container>
		<div v-if="$route.name == 'Septic'">
			<file-header input-file="septic.sep" docs-path="databases">
				Septic
			</file-header>

			<grid-view 
				api-url="db/septic"
				collection-description="septic"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="septic.csv" table-name="sep" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Septic'
}
</script>
