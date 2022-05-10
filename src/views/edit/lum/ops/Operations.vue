<template>
	<project-container>
		<div v-if="$route.name == 'Operations'">
			<h1 class="fileheader">
				Operations Databases
			</h1>

			<div class="list-group">
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/harvest">Harvest Operations</router-link>
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/graze">Graze Operations</router-link>
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/irrigation">Irrigation Operations</router-link>
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/chemapp">Chemical Application Operations</router-link>
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/fire">Fire Operations</router-link>
				<router-link class="list-group-item list-group-item-action text-primary" to="/edit/lum/ops/sweep">Sweep Operations</router-link>
			</div>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Operations'
}
</script>