<template>
	<project-container>
		<file-header input-file="rout_unit.con" docs-path="connections/routing-units">
			<router-link to="/edit/routing_unit">Routing Units</router-link>
			/ Create
		</file-header>

		<routing-unit-form :item="item" :api-url="apiUrl"></routing-unit-form>
	</project-container>
</template>

<script>
import RoutingUnitForm from './RoutingUnitForm.vue';

export default {
	name: 'RoutingUnitCreate',
	components: {
		RoutingUnitForm
	},
	data() {
		return {
			apiUrl: 'routing_unit',
			item: {
				connect: {
					name: null,
					area: 0,
					lat: 0,
					lon: 0,
					elev: null,
					wst_name: null
				},
				props: {},
				outflow: []
			}
		}
	}
}
</script>