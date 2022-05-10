<template>
	<project-container>
		<file-header input-file="soils.sol" docs-path="soils">
			<router-link to="/edit/soils">Soils</router-link>
			/ Create
		</file-header>

		<soils-form :item="item" />
	</project-container>
</template>

<script>
import SoilsForm from './SoilsForm';

export default {
	name: 'SoilsCreate',
	components: {
		SoilsForm
	},
	data() {
		return {
			item: {
				name: null,
				hyd_grp: null,
				dp_tot: 0,
				anion_excl: 0,
				perc_crk: 0,
				texture: null,
				description: null
			}
		}
	}
}
</script>