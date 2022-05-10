<template>
	<project-container>
		<div v-if="$route.name == 'AquifersInitial'">
			<file-header input-file="initial.aqu" docs-path="connections/aquifers">
				<router-link to="/edit/aquifers">Aquifers</router-link> 
				/ Initial
			</file-header>

			<grid-view 
				api-url="aquifers/initial"
				collection-description="aquifer initial properties"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields"
				:router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'AquifersInitial',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'org_min', label: 'Organic Mineral', sortable: true },
				{ key: 'pest', label: 'Pesticide', sortable: true },
				{ key: 'path', label: 'Pathogen', sortable: true },
				{ key: 'hmet', label: 'Heavy Metal', sortable: true },
				{ key: 'salt', label: 'Salt', sortable: true },
				{ key: 'description', label: 'Description', sortable: true }
			],
			routerLinkFields: [
				{ key: 'org_min', route: '/edit/init/om_water/edit/' },
				{ key: 'pest', route: '#' },
				{ key: 'path', route: '#' },
				{ key: 'hmet', route: '#' },
				{ key: 'salt', route: '#' }
			]
		}
	}
}
</script>