<template>
	<project-container>
		<div v-if="$route.name == 'OperationsIrrigation'">
			<file-header input-file="irr.ops" docs-path="land-use-management#irrigation">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Irrigation
			</file-header>

			<grid-view 
				api-url="ops/irrigation"
				collection-description="irrigation operations"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="irr.ops" table-name="irr_ops" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsIrrigation'
}
</script>
