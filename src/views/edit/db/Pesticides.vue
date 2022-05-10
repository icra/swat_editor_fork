<template>
	<project-container>
		<div v-if="$route.name == 'Pesticides'">
			<file-header input-file="pesticide.pes" docs-path="databases">
				Pesticides
			</file-header>

			<grid-view 
				api-url="db/pesticides"
				collection-description="pesticides"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="pesticides.csv" table-name="pest" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Pesticides'
}
</script>
