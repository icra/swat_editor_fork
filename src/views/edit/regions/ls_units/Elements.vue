<template>
	<project-container>
		<div v-if="$route.name == 'LandscapeUnitsElements'">
			<file-header input-file="ls_unit.ele" docs-path="regions">
				<router-link to="/edit/regions/ls_units">Landscape Units</router-link> 
				/ Elements
			</file-header>

			<grid-view 
				api-url="ls_units/elements"
				collection-description="landscape units"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields"
				:router-link-fields="routerLinkFields">
			</grid-view>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'LandscapeUnitsElements',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'obj_typ', label: 'Type', sortable: true },
				{ key: 'obj_name', label: 'Object', sortable: true },
				{ key: 'bsn_frac', label: 'Basin Fraction', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 6) }},
				{ key: 'sub_frac', label: 'Subbasin Fraction', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 6) }},
				{ key: 'reg_frac', label: 'Region Fraction', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 6) }},
				{ key: 'ls_unit_def', label: 'Landscape Unit', sortable: true, class: 'text-center' }
			],
			routerLinkFields: [
				{ key: 'ls_unit_def', route: '/edit/regions/ls_units/edit/' }
			]
		}
	}
}
</script>