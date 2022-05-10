<template>
	<project-container>
		<div v-if="$route.name == 'DecisionsScenLu'">
			<decisions-grid decisions-table="scen_lu.dtl" description="Scenario Land Use" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import DecisionsGrid from './DecisionsGrid';

export default {
	name: 'DecisionsScenLu',
	components: {
		DecisionsGrid
	}
}
</script>