<template>
	<project-container>
		<div v-if="$route.name == 'Urban'">
			<file-header input-file="urban.urb" docs-path="databases">
				Urban
			</file-header>

			<grid-view 
				api-url="db/urban"
				collection-description="urban"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="urban.csv" table-name="urban" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Urban'
}
</script>
