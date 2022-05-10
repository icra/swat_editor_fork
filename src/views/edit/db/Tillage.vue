<template>
	<project-container>
		<div v-if="$route.name == 'Tillage'">
			<file-header input-file="tillage.til" docs-path="databases">
				Tillage
			</file-header>

			<grid-view 
				api-url="db/tillage"
				collection-description="tillage"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="tillage.csv" table-name="till" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Tillage'
}
</script>
