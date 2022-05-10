<!--//ICRA Adrià Riu -- Pollutants db view-->

<template>
	<project-container>
		<div v-if="$route.name == 'Pollutants'">
			<file-header input-file="pollutants.pth" docs-path="databases">
				Pollutants
			</file-header>

			<grid-view
				api-url="db/pollutants"
				collection-description="pollutants"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="pollutants.csv" table-name="path" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Pollutants',
	mounted() {
		console.log("Show Pollutants list")
	}
}
</script>
