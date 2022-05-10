<template>
	<project-container>
		<div v-if="$route.name == 'DelratioOM'">
			<file-header input-file="dr_om.del" docs-path="connections/delivery-ratio">
				<router-link to="/edit/dr">Delivery Ratio</router-link> 
				/ Organic Mineral
			</file-header>

			<grid-view 
				api-url="dr/om"
				collection-description="records"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="dr_om.csv" table-name="om_del" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'DelratioOM'
}
</script>
