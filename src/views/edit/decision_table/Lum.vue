<template>
	<project-container>
		<div v-if="$route.name == 'DecisionsLum'">
			<decisions-grid decisions-table="lum.dtl" description="Land Use Management" />
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
import DecisionsGrid from './DecisionsGrid';

export default {
	name: 'DecisionsLum',
	components: {
		DecisionsGrid
	}
}
</script>