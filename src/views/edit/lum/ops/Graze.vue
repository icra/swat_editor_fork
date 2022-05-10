<template>
	<project-container>
		<div v-if="$route.name == 'OperationsGraze'">
			<file-header input-file="graze.ops" docs-path="land-use-management#graze">
				<router-link to="/edit/lum/ops">Operations</router-link> 
				/ Graze
			</file-header>

			<grid-view 
				api-url="ops/graze"
				collection-description="graze operations"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields"
				:router-link-fields="routerLinkFields" show-edit-many />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'OperationsGraze',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'fert', label: 'Fertilizer', sortable: true },
				{ key: 'bm_eat', label: 'Bm_eat', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'bm_tramp', label: 'Bm_tramp', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'man_amt', label: 'Man_amt', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'grz_bm_min', label: 'Grz_bm_min', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 3) } },
				{ key: 'description', label: 'Description', sortable: true },
			],
			routerLinkFields: [
				{ key: 'fert', route: '/edit/db/fertilizer/edit/' }
			]
		}
	}
}
</script>
