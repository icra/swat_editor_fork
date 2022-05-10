<template>
	<project-container>
		<div v-if="$route.name == 'Reservoirs'">
			<file-header input-file="reservoir.con" docs-path="connections/reservoirs">
				Reservoirs
			</file-header>

			<connect-grid-view 
				api-url="reservoirs"
				collection-description="reservoirs"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Reservoirs',
	data () {
		return {
			fields: [
				{ key: 'init', label: 'Initial', sortable: true, class: 'text-right' },
				{ key: 'rel', label: 'Release', sortable: true, class: 'text-right' },
				{ key: 'hyd', label: 'Hydrology', sortable: true, class: 'text-right' },
				{ key: 'sed', label: 'Sediment', sortable: true, class: 'text-right' },
				{ key: 'nut', label: 'Nutrients', sortable: true, class: 'text-right' }
			],
			routerLinkFields: [
				{ key: 'init', route: '/edit/reservoirs/initial/edit/' },
				{ key: 'rel', route: '/edit/decision_table/edit/' },
				{ key: 'hyd', route: '/edit/reservoirs/hydrology/edit/' },
				{ key: 'sed', route: '/edit/reservoirs/sediment/edit/' },
				{ key: 'nut', route: '/edit/reservoirs/nutrients/edit/' }
			]
		}
	}
}
</script>
