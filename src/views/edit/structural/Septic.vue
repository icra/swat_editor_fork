<template>
	<project-container>
		<div v-if="$route.name == 'SepticStr'">
			<file-header input-file="septic.str" docs-path="structural">
				Septic Systems
			</file-header>

			<grid-view 
				api-url="structural/septic"
				collection-description="septic systems"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="septic.csv" table-name="septic_str" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'SepticStr'
}
</script>
