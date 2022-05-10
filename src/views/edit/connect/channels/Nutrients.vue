<template>
	<project-container>
		<div v-if="$route.name == 'ChannelsNutrients'">
			<file-header input-file="nutrients.cha" docs-path="connections/channels">
				<router-link to="/edit/channels">Channels</router-link> 
				/ Nutrients
			</file-header>

			<grid-view 
				api-url="channels/nutrients"
				collection-description="channel nutrients properties"
				use-filter use-action-bar
				default-sort="name"
				use-dynamic-fields 
				show-import-export default-csv-file="nutrients-cha.csv" table-name="nut_cha" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'ChannelsNutrients'
}
</script>
