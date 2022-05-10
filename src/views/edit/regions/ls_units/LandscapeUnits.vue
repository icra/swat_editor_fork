<template>
	<project-container>
		<div v-if="$route.name == 'LandscapeUnits'">
			<file-header input-file="ls_unit.def" docs-path="regions">
				Landscape Units
			</file-header>

			<grid-view 
				api-url="ls_units"
				collection-description="landscape units"
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
	name: 'LandscapeUnits',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'area', label: 'Area', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'num_elements', label: 'Number of elements', sortable: false, class: 'text-right' }
			]
		}
	}
}
</script>