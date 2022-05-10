<template>
	<project-container>
		<div v-if="$route.name == 'OperationsChemApp'">
			<file-header input-file="chem_app.ops" docs-path="land-use-management#chemical-application">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Chemical Applications
			</file-header>

			<grid-view 
				api-url="ops/chemapp"
				collection-description="chemical application operations"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="chem_app.ops" table-name="chem_app_ops" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsChemApp'
}
</script>
