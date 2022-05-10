<template>
	<project-container>
		<div v-if="$route.name == 'Pathogens'">
			<file-header input-file="pathogens.pth" docs-path="databases">
				Pathogens
			</file-header>

			<grid-view 
				api-url="db/pathogens"
				collection-description="pathogens"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="pathogens.csv" table-name="path" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Pathogens'
}
</script>
