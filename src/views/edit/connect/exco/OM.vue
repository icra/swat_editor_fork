<template>
	<project-container>
		<div v-if="$route.name == 'ExcoOM'">
			<file-header input-file="exco_om.exc" docs-path="connections/export-coefficients">
				<router-link to="/edit/exco">Export Coefficients</router-link> 
				/ Organic Mineral
			</file-header>

			<grid-view 
				api-url="exco/om"
				collection-description="records"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields
				show-import-export default-csv-file="exco_om.csv" table-name="om_exc" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ExcoOM'
}
</script>