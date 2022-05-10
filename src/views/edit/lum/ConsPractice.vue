<template>
	<project-container>
		<div v-if="$route.name == 'ConsPractice'">
			<file-header input-file="cons_practice.lum" docs-path="land-use-management#conservation-practices">
				Conservation Practices
			</file-header>

			<grid-view 
				api-url="cons_prac"
				collection-description="conservation practices"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="cons_practice.csv" table-name="cons_prac" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ConsPractice'
}
</script>
