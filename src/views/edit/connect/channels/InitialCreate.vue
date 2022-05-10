<template>
	<project-container>
		<file-header input-file="initial.cha" docs-path="connections/channels">
			<router-link to="/edit/channels">Channels</router-link> / 
			<router-link to="/edit/channels/initial">Initial</router-link>
			/ Create
		</file-header>

		<initial-form :item="channel" />
	</project-container>
</template>

<script>
import InitialForm from './InitialForm';

export default {
	name: 'ChannelsInitialCreate',
	components: {
		InitialForm
	},
	data() {
		return {
			channel: {
				name: null,
				description: null,
				org_min_name: null,
				pest_name: null,
				path_name: null,
				hmet_name: null,
				salt_name: null
			}
		}
	}
}
</script>