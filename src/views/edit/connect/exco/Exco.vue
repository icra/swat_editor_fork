<template>
	<project-container>
		<div v-if="$route.name == 'Exco'">
			<file-header input-file="exco.con" docs-path="connections/export-coefficients">
				Export Coefficients
			</file-header>

			<p>
				<b-link v-b-modal.modal-1>Special note about using export coefficients with constant point source/inlet data</b-link>
			</p>
			<b-modal id="modal-1" title="Constant point source/inlet data" hide-footer>
				<p>
					In SWAT+, constant values for point sources and inlets are stored in the export coefficients properties file, exco.exc, while time series data are stored entirely in the recall section.
				</p>
				<p>
					However, in the editor, we keep both constant and time series point sources and inlets in the <strong>recall section</strong>. When you write input files, the editor will write to the exco.exc and exco_om.exc files appropriately.
				</p>
			</b-modal>

			<connect-grid-view 
				api-url="exco"
				collection-description="export coefficients"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Exco',
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
				{ key: 'om', route: '/edit/exco/om/edit/' },
				{ key: 'pest', route: '#' }, //  /edit/exco/pest/edit/
				{ key: 'path', route: '#' }, //  /edit/exco/path/edit/ 
				{ key: 'hmet', route: '#' }, //  /edit/exco/hmet/edit/
				{ key: 'salt', route: '#' }  //  /edit/exco/salt/edit/ 
			]
		}
	}
}
</script>
