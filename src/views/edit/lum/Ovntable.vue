<template>
	<project-container>
		<div v-if="$route.name == 'Ovntable'">
			<file-header input-file="ovn_table.lum" docs-path="land-use-management#overland-flow-mannings-n">
				Manning's n Tables
			</file-header>

			<grid-view 
				api-url="ovntable"
				collection-description="ovn tables"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="ovn_table.csv" table-name="ovntable" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Ovntable'
}
</script>
