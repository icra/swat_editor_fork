<template>
	<project-container>
		<div v-if="$route.name == 'InitPlant'">
			<file-header input-file="plant.ini" docs-path="initialization-data">
				Plant Communities
			</file-header>

			<grid-view 
				api-url="plant_ini"
				collection-description="plant communities"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields">
			</grid-view>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'InitPlant',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'rot_yr_ini', label: 'Initial rotation year', sortable: true },
				{ key: 'num_plants', label: 'Number of plants', sortable: false },
				{ key: 'description', label: 'Description', sortable: true }
			]
		}
	}
}
</script>