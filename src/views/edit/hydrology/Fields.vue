<template>
	<project-container>
		<div v-if="$route.name == 'Fields'">
			<file-header input-file="field.fld" docs-path="hydrology">
				Fields
			</file-header>

			<grid-view
				api-url="fields"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="fields.csv" table-name="fld"  />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Fields'
}
</script>