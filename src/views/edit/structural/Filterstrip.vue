<template>
	<project-container>
		<div v-if="$route.name == 'FilterstripStr'">
			<file-header input-file="filterstrip.str" docs-path="structural">
				Filter Strips
			</file-header>

			<grid-view 
				api-url="structural/filterstrip"
				collection-description="filterstrips"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="filterstrip.csv" table-name="filterstrip_str" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'FilterstripStr'
}
</script>
