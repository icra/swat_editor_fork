<template>
	<project-container>
		<div v-if="$route.name == 'Topography'">
			<file-header input-file="topography.hyd" docs-path="hydrology">
				Topography
			</file-header>

			<grid-view
				api-url="topography"
				use-filter use-action-bar
				default-sort="name" 
				:fields="fields" 
				show-import-export default-csv-file="topography.csv" table-name="topo"  />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Topography',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'slp', label: 'slp', sortable: true, formatter: (value) => { return this.numberFormat(value, 5) } },
				{ key: 'slp_len', label: 'slp_len', sortable: true },
				{ key: 'lat_len', label: 'lat_len', sortable: true },
				{ key: 'dist_cha', label: 'dist_cha', sortable: true },
				{ key: 'depos', label: 'depos', sortable: true }
			],
		}
	}
}
</script>