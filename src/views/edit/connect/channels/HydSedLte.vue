<template>
	<project-container>
		<div v-if="$route.name == 'ChannelsHydSedLte'">
			<file-header input-file="hyd-sed-lte.cha" docs-path="connections/channels">
				<router-link to="/edit/channels">Channels</router-link> 
				/ Hydrology &amp; Sediment
			</file-header>

			<grid-view 
				api-url="channels-lte/hydsed"
				collection-description="channel properties"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="hyd-sed-lte-cha.csv" table-name="hyd_sed_lte_cha" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ChannelsHydSedLte'
}
</script>
