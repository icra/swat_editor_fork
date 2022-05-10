<template>
	<project-container>
		<div v-if="$route.name == 'Cntable'">
			<file-header input-file="cntable.lum" docs-path="land-use-management#curve-number-table">
				Curve Numbers
			</file-header>

			<grid-view 
				api-url="cntable"
				collection-description="curve number tables"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="cntable.csv" table-name="cntable" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Cntable'
}
</script>
