<template>
	<project-container>
		<div v-if="$route.name == 'Soils'">
			<file-header input-file="soils.sol" docs-path="soils">
				Soils
			</file-header>

			<grid-view 
				api-url="soils"
				collection-description="soils"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields   />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Soils'
}
</script>
