<template>
	<project-container>
		<div v-if="$route.name == 'OperationsHarvest'">
			<file-header input-file="harv.ops" docs-path="land-use-management#harvest">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Harvest
			</file-header>

			<grid-view 
				api-url="ops/harvest"
				collection-description="harvest operations"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="harv.ops" table-name="harv_ops" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsHarvest'
}
</script>
