<template>
	<project-container>
		<div v-if="$route.name == 'ReservoirsWetlands'">
			<file-header input-file="wetlands.wet" docs-path="connections/reservoirs">
				<router-link to="/edit/reservoirs">Reservoirs</router-link> 
				/ Wetlands
			</file-header>

			<grid-view 
				api-url="reservoirs/wetlands"
				collection-description="wetlands"
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
	name: 'ReservoirsWetlands',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'init', label: 'Initial', sortable: true },
				{ key: 'rel', label: 'Release', sortable: true },
				{ key: 'hyd', label: 'Wetlands Hydrology', sortable: true },
				{ key: 'sed', label: 'Sediment', sortable: true },
				{ key: 'nut', label: 'Nutrients', sortable: true },
				{ key: 'description', label: 'Description', sortable: true }
			],
			routerLinkFields: [
				{ key: 'init', route: '/edit/reservoirs/initial/edit/' },
				{ key: 'rel', route: '/edit/decision_table/edit/' },
				{ key: 'hyd', route: '/edit/reservoirs/wetlands_hydrology/edit/' },
				{ key: 'sed', route: '/edit/reservoirs/sediment/edit/' },
				{ key: 'nut', route: '/edit/reservoirs/nutrients/edit/' }
			]
		}
	}
}
</script>
