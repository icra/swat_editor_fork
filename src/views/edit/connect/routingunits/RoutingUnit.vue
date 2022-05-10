<template>
	<project-container>
		<div v-if="$route.name == 'RoutingUnit'">
			<file-header input-file="rout_unit.con" docs-path="connections/routing-units">
				Routing Units
			</file-header>

			<connect-grid-view 
				api-url="routing_unit"
				collection-description="routing units"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'RoutingUnit',
	data () {
		return {
			fields: [
				{ key: 'topo', label: 'Topography', sortable: true, class: 'text-right' },
				{ key: 'dlr', label: 'Del. Ratio', sortable: true, class: 'text-right' },
				{ key: 'field', label: 'Field', sortable: true, class: 'text-right' }
			],
			routerLinkFields: [
				{ key: 'topo', route: '/edit/topography/edit/' },
				{ key: 'dlr', route: '#' },
				{ key: 'field', route: '/edit/fields/edit/' }
			]
		}
	}
}
</script>