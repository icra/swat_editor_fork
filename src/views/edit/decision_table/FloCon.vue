<template>
	<project-container>
		<div v-if="$route.name == 'DecisionsFloCon'">
			<decisions-grid decisions-table="flo_con.dtl" description="Flow Conditions" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import DecisionsGrid from './DecisionsGrid';

export default {
	name: 'DecisionsFloCon',
	components: {
		DecisionsGrid
	}
}
</script>