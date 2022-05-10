<template>
	<project-container>
		<div v-if="$route.name == 'Hrus'">
			<file-header input-file="hru.con" docs-path="connections/hrus">
				HRUs
			</file-header>

			<connect-grid-view
				api-url="hrus"
				collection-description="HRUs"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Hrus',
	data() {
		return {
			fields: [
				{ key: 'topo', label: 'Topography', sortable: true },
				{ key: 'hydro', label: 'Hydrology', sortable: true },
				{ key: 'soil', label: 'Soils', sortable: true },
				{ key: 'lu_mgt', label: 'Landuse', sortable: true },
				{ key: 'soil_plant_init', label: 'Soil Plant', sortable: true },
				{ key: 'surf_stor', label: 'Surface Storage', sortable: true },				
				{ key: 'snow', label: 'Snow', sortable: true },
				{ key: 'field', label: 'Field', sortable: true }
			],
			routerLinkFields: [
				{ key: 'topo', route: '/edit/topography/edit/' },
				{ key: 'hydro', route: '/edit/hydrology/edit/' },
				{ key: 'soil', route: '/edit/soils/edit/' },
				{ key: 'lu_mgt', route: '/edit/lum/landuse/edit/' },
				{ key: 'soil_plant_init', route: '/edit/init/soil_plant/edit/' },
				{ key: 'surf_stor', route: '/edit/reservoirs/wetlands/edit/' },
				{ key: 'snow', route: '/edit/db/snow/edit/' },
				{ key: 'field', route: '/edit/fields/edit/' },
			]
		}
	}
}
</script>