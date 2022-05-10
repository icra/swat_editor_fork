<template>
	<div>
		<grid-view ref="connectGrid"
			:api-url="apiUrl"
			:collection-description="collectionDescription"
			use-filter use-action-bar
			:default-sort="defaultSort"
			:fields="tableFields" :router-link-fields="tableRouterLinkFields">
			<slot></slot>
		</grid-view>
	</div>
</template>

<script>
export default {
	name: 'ConnectGridView',
	props: {
		fields: {
			type: Array
		},
		routerLinkFields: {
			type: Array,
			default: () => [{ key: 'none', route: 'none' }] 
		},
		apiUrl: {
			type: String,
			required: true
		},
		collectionDescription: {
			type: String,
			default: 'items'
		},
		defaultSort: {
			type: String,
			default: 'name'
		}
	},
	data() {
		return {
			connect: {
				fields: [
					{ key: 'name', label: 'Name', sortable: true },
					{ key: 'area', label: 'Area (ha)', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'lat', label: 'Lat', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'lon', label: 'Lon', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2) } },
					{ key: 'elev', label: 'Elev (m)', sortable: true, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 2, '', 'null') } },
					{ key: 'wst', label: 'Weather Station', sortable: true, class: 'text-right' }
					
				],
				endFields: [
					{ key: 'outflow', label: '# Outflow', sortable: false, class: 'text-right', formatter: (value) => { return this.numberFormat(value, 0) } }
				],
				routerLinkFields: [
					{ key: 'wst', route: '/edit/stations/edit/' }
				]
			}
		}
	},
	methods: {
		async get() {
			await this.$refs.connectGrid.get();
		}
	},
	computed: {
		tableFields() {
			return this.connect.fields.concat(this.fields, this.connect.endFields)
		},
		tableRouterLinkFields() {
			return this.connect.routerLinkFields.concat(this.routerLinkFields);
		}
	}
}
</script>