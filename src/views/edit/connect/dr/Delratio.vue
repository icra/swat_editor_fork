<template>
	<project-container>
		<div v-if="$route.name == 'Delratio'">
			<file-header input-file="delratio.con" docs-path="connections/delivery-ratio">
				Delivery Ratio 
			</file-header>

			<connect-grid-view 
				api-url="dr"
				collection-description="delivery ratio records"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Delratio',
	data () {
		return {
			fields: [
				{ key: 'om', label: 'Organic Mineral', sortable: true, class: 'text-right' },
				{ key: 'pest', label: 'Pesticides', sortable: true, class: 'text-right' },
				{ key: 'path', label: 'Pathogens', sortable: true, class: 'text-right' },
				{ key: 'hmet', label: 'Heavy Metals', sortable: true, class: 'text-right' },
				{ key: 'salt', label: 'Salt', sortable: true, class: 'text-right' }
			],
			routerLinkFields: [
				{ key: 'om', route: '/edit/dr/om/edit/' },
				{ key: 'pest', route: '#' }, //  /edit/dr/pest/edit/
				{ key: 'path', route: '#' }, //  /edit/dr/path/edit/ 
				{ key: 'hmet', route: '#' }, //  /edit/dr/hmet/edit/
				{ key: 'salt', route: '#' }  //  /edit/dr/salt/edit/ 
			]
		}
	}
}
</script>
