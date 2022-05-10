<template>
	<project-container>
		<div v-if="$route.name == 'DecisionsResRel'">
			<decisions-grid decisions-table="res_rel.dtl" description="Reservoir Release" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import DecisionsGrid from './DecisionsGrid';

export default {
	name: 'DecisionsResRel',
	components: {
		DecisionsGrid
	}
}
</script>