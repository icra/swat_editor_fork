<template>
	<project-container>
		<div v-if="$route.name == 'OperationsSweep'">
			<file-header input-file="sweep.ops" docs-path="land-use-management#sweep">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Sweep
			</file-header>

			<grid-view 
				api-url="ops/sweep"
				collection-description="sweep operations"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="sweep.ops" table-name="sweep_ops" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsSweep'
}
</script>
