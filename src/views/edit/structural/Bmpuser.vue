<template>
	<project-container>
		<div v-if="$route.name == 'BmpuserStr'">
			<file-header input-file="bmpuser.str" docs-path="structural">
				User Best Management Practices
			</file-header>

			<grid-view 
				api-url="structural/bmpuser"
				collection-description="best management practices"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="bmpuser.csv" table-name="bmpuser_str" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'BmpuserStr'
}
</script>
