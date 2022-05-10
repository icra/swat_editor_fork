<template>
	<project-container>
		<div v-if="$route.name == 'Landuse'">
			<file-header input-file="landuse.lum" docs-path="land-use-management">
				Land Use Management
			</file-header>

			<grid-view 
				api-url="landuse"
				collection-description="land use properties"
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
	name: 'Landuse',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'cal_group', label: 'Calibration Group', sortable: true },
				{ key: 'plnt_com', label: 'Plant Comm.', sortable: true },
				{ key: 'mgt', label: 'Management Sch.', sortable: true },
				{ key: 'cn2', label: 'CN2', sortable: true },
				{ key: 'cons_prac', label: 'Cons. Prac.', sortable: true },
				{ key: 'urban', label: 'Urban', sortable: true },
				{ key: 'urb_ro', label: 'Urban Runoff', sortable: true },
				{ key: 'ov_mann', label: "Manning's n", sortable: true },
				{ key: 'tile', label: 'Tile Drain', sortable: true },
				{ key: 'sep', label: 'Septic Tank', sortable: true },
				{ key: 'vfs', label: 'Filter Strip', sortable: true },
				{ key: 'grww', label: 'Grassed Waterway', sortable: true },
				{ key: 'bmp', label: 'BMPs', sortable: true },
				{ key: 'description', label: 'Description', sortable: true }
			],
			routerLinkFields: [
				{ key: 'plnt_com', route: '/edit/init/plant/edit/' },
				{ key: 'mgt', route: '/edit/lum/mgt/edit/' },
				{ key: 'cn2', route: '/edit/lum/cntable/edit/' },
				{ key: 'cons_prac', route: '/edit/lum/conspractice/edit/' },
				{ key: 'urban', route: '/edit/db/urban/edit/' },
				{ key: 'ov_mann', route: '/edit/lum/ovntable/edit/' },
				{ key: 'tile', route: '/edit/structural/tiledrain/edit/' },
				{ key: 'sep', route: '/edit/structural/septic/edit/' },
				{ key: 'vfs', route: '/edit/structural/filterstrip/edit/' },
				{ key: 'grww', route: '/edit/structural/grassedww/edit/' },
				{ key: 'bmp', route: '/edit/structural/bmpuser/edit/' },
			]
		}
	}
}
</script>