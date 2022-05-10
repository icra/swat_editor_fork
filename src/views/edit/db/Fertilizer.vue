<template>
	<project-container>
		<div v-if="$route.name == 'Fertilizer'">
			<file-header input-file="fertilizer.frt" docs-path="databases">
				Fertilizer
			</file-header>

			<grid-view 
				api-url="db/fertilizer"
				collection-description="fertilizer"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="fertilizer.csv" table-name="fert" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Fertilizer'
}
</script>
