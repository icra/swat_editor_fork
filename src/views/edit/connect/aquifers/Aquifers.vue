<template>
	<project-container>
		<div v-if="$route.name == 'Aquifers'">
			<file-header input-file="aquifer.con" docs-path="connections/aquifers">
				Aquifers
			</file-header>

			<connect-grid-view 
				api-url="aquifers"
				collection-description="routing units"
				:fields="fields" :router-link-fields="routerLinkFields" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Aquifers',
	data () {
		return {
			fields: [
				{ key: 'init', label: 'Initial', sortable: true, class: 'text-right' },
				{ key: 'gw_flo', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'dep_bot', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'dep_wt', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'no3_n', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'sol_p', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'carbon', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'flo_dist', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'bf_max', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'alpha_bf', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'revap', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'rchg_dp', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'spec_yld', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'hl_no3n', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'flo_min', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'revap_min', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } }
			],
			routerLinkFields: [
				{ key: 'init', route: '/edit/aquifers/initial/edit/' }
			]
		}
	}
}
</script>
