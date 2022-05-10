<template>
	<project-container>
		<div v-if="$route.name == 'RoutingUnitElements'">
			<file-header input-file="rout_unit.ele" docs-path="connections/routing-units">
				<router-link to="/edit/routing_unit">Routing Units</router-link>
				/ Elements
			</file-header>

			<grid-view 
				api-url="routing_unit/elements"
				collection-description="routing unit elements"
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
import GridView from '@/components/GridView';

export default {
	name: 'RoutingUnitElements',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'obj_typ', label: 'Type', sortable: true },
				{ key: 'obj_name', label: 'Object', sortable: true },
				{ key: 'frac', label: 'Fraction', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 6) }},
				{ key: 'rtu', label: 'Routing Unit', sortable: true, class: 'text-center' },
				{ key: 'dlr', label: 'Delivery Ratio', sortable: true, class: 'text-center' }
			],
			routerLinkFields: [
				{ key: 'rtu', route: '/edit/routing_unit/edit/' },
				{ key: 'dlr', route: '/edit/dr/edit/' }
			]
		}
	},
	components: {
		GridView
	}
}
</script>