<template>
	<project-container>
		<file-header input-file="initial.aqu" docs-path="connections/aquifers">
			<router-link to="/edit/aquifers">Aquifers</router-link> / 
			<router-link to="/edit/aquifers/initial">Initial</router-link>
			/ Create
		</file-header>

		<initial-form :item="item" />
	</project-container>
</template>

<script>
import InitialForm from './InitialForm';

export default {
	name: 'AquifersInitialCreate',
	components: {
		InitialForm
	},
	data() {
		return {
			item: {
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