<template>
	<project-container>
		<div v-if="$route.name == 'Channels'">
			<file-header input-file="chandeg.con" docs-path="connections/channels">
				Channels
			</file-header>

			<connect-grid-view 
				api-url="channels-lte"
				collection-description="channels"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Channels',
	data() {
		return {
			fields: [
				{ key: 'init', label: 'Initial', sortable: true, class: 'text-right' },
				{ key: 'hyd', label: 'Hyd./Sed.', sortable: true, class: 'text-right' },
				{ key: 'nut', label: 'Nutrients', sortable: true, class: 'text-right' }
			],
			routerLinkFields: [
				{ key: 'init', route: '/edit/channels/initial/edit/' }, 
				{ key: 'hyd', route: '/edit/channels/hydsed/edit/' }, 
				{ key: 'nut', route: '/edit/channels/nutrients/edit/' } 
			]
		}
	}
}
</script>