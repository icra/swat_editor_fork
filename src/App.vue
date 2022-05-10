<template>
	<div id="app">
		<div v-if="$route.name.includes('TableBrowser')" class="container-fluid py-2 px-3">
			<router-view></router-view>
		</div>
		<div id="content-frame" v-else>
			<div id="side-panel">
				<ul class="vertical menu pt-1">
					<li><router-link to="/setup" v-b-tooltip.hover.right="`Project setup and information`"><font-awesome-icon :icon="['fas', 'folder-open']" fixed-width /></router-link></li>
					<li><router-link v-if="hasCurrentProject && currentProjectSupported" to="/edit" v-b-tooltip.hover.right="'Edit SWAT+ inputs'"><font-awesome-icon :icon="['fas', 'pencil-alt']" fixed-width /></router-link></li>
					<li><router-link v-if="hasCurrentProject && currentProjectSupported" to="/run" v-b-tooltip.hover.right="'Run SWAT+'"><font-awesome-icon :icon="['fas', 'play']" fixed-width /></router-link></li>
					<li><router-link v-if="hasCurrentProject && currentProjectSupported && !currentProject.isLte" to="/check" v-b-tooltip.hover.right="'SWAT+ Check'"><font-awesome-icon :icon="['fas', 'check']" fixed-width /></router-link></li>
				</ul>

				<ul class="vertical menu bottom">
					<li><span class="menu-item" id="popover-info"><font-awesome-icon :icon="['fas', 'info-circle']" fixed-width /></span></li>
					<li><router-link to="/help" v-b-tooltip.hover.right="'Help and documentation'"><font-awesome-icon :icon="['fas', 'question-circle']" fixed-width /></router-link></li>
				</ul>
			</div>

			<b-popover target="popover-info" triggers="hover" placement="right">
				<template v-slot:title>SWAT+ Editor {{version}}</template>
				<ul class="list-unstyled my-1" v-if="hasCurrentProject && currentProjectSupported">
					<li class="mb-1">{{currentProject.name}}</li>
					<li class="mb-1"><router-link to="/setup">Project information</router-link></li>
					<li><open-file :file-path="projectPath">Open project directory</open-file></li>
				</ul>
				<div v-else>
					<em>Open a project to get started.</em>
				</div>
			</b-popover> 

			<router-view></router-view>

			<div class="update-notifications d-flex" v-if="updates.show">
				<div class="pr-2"><font-awesome-icon :icon="['fas', 'spinner']" spin /></div>
				<div class="pr-4">{{updates.message}}</div>
				<div class="ml-auto text-muted pointer" @click="updates.show=false"><font-awesome-icon :icon="['fas', 'times']" /></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	@import 'app.scss';
</style>

<script>
const remote = window.require('electron').remote;
const ipcRenderer = window.require('electron').ipcRenderer;
const path = window.require('path');

export default {
	name: 'app',
	created() {
		this.get();
	},
	data() {
		return {
			updates: {
				show: false,
				message: undefined
			}
		}
	},
	methods: {
		get() {
			var self = this;
			ipcRenderer.on('message', function(event, text) {
				console.log(text);
				self.updates.message = text;
				self.updates.show = true;
			});

			ipcRenderer.on('clearMessage', function(event, text) {
				console.log(text);
				self.updates.show = false;
			});
		}
	},
	computed: {
		projectPath() {
			if (!this.hasCurrentProject) return null;
			return path.dirname(this.currentProject.projectDb);
		}
	}
}
</script>