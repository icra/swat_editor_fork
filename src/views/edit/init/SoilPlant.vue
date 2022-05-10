<template>
	<project-container>
		<div v-if="$route.name == 'InitSoilPlant'">
			<file-header input-file="soil_plant.ini" docs-path="initialization-data">
				Soil Plant
			</file-header>

			<grid-view 
				api-url="/soil_plant"
				collection-description="soil_plant"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields"
				:router-link-fields="routerLinkFields" show-edit-many>
			</grid-view>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'InitSoilPlant',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'sw_frac', label: 'Soil Water Fraction', sortable: true },
				{ key: 'nutrients', label: 'Nutrients', sortable: true },
				{ key: 'pest', label: 'Pesticides', sortable: true },
				{ key: 'path', label: 'Pathogens', sortable: true },
				{ key: 'hmet', label: 'Heavy Metals', sortable: true },
				{ key: 'salt', label: 'Salt', sortable: true },
			],
			routerLinkFields: [
				{ key: 'nutrients', route: '/edit/soil-nutrients/edit/' },   // use this /edit/dr/om/edit/ instead of #
				{ key: 'pest', route: '#' }, //  /edit/dr/pest/edit/
				{ key: 'path', route: '#' }, //  /edit/dr/path/edit/ 
				{ key: 'hmet', route: '#' }, //  /edit/dr/hmet/edit/
				{ key: 'salt', route: '#' }  //  /edit/dr/salt/edit/ 
			]
		}
	}
}
</script>
