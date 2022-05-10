<template>
	<project-container>
		<div v-if="$route.name == 'InitOMWater'">
			<file-header input-file="om_water.ini" docs-path="initialization-data">
				Organic Mineral Water
			</file-header>

			<grid-view 
				api-url="/om_water"
				collection-description="organic mineral water"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="om_water_ini.csv" table-name="om_water_ini" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'InitOMWater'
}
</script>