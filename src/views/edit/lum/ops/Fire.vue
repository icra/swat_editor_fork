<template>
	<project-container>
		<div v-if="$route.name == 'OperationsFire'">
			<file-header input-file="fire.ops" docs-path="land-use-management#fire">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Fire
			</file-header>

			<grid-view 
				api-url="ops/fire"
				collection-description="fire operations"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="fire.ops" table-name="fire_ops" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsFire'
}
</script>
