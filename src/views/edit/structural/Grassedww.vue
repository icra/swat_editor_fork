<template>
	<project-container>
		<div v-if="$route.name == 'GrassedwwStr'">
			<file-header input-file="grassedww.str" docs-path="structural">
				Grassed Waterways
			</file-header>

			<grid-view 
				api-url="structural/grassedww"
				collection-description="grassed waterways"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="grassedww.csv" table-name="grassedww_str" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'GrassedwwStr'
}
</script>
