<template>
	<project-container>
		<file-header input-file="chandeg.con" docs-path="connections/channels">
			<router-link to="/edit/channels">Channels</router-link>
			/ Create
		</file-header>

		<channels-form :item="item" :api-url="apiUrl"></channels-form>
	</project-container>
</template>

<script>
import ChannelsForm from './ChannelsForm.vue';

export default {
	name: 'ChannelsCreate',
	components: {
		ChannelsForm
	},
	data() {
		return {
			apiUrl: 'channels-lte',
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