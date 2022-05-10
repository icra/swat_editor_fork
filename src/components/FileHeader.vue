<template>
	<div>
		<h1 class="file-header d-flex align-items-end mb-3">
			<span class="heading mr-1">
				<slot></slot>
			</span>
			<span class="info ml-auto">
				{{inputFile}}
				<font-awesome-icon :icon="['fas', 'book']" class="ml-2 pointer" v-b-tooltip.hover.bottom="'Documentation'" @click="open" v-if="docsPath != ''" />
			</span>
		</h1>
	</div>
</template>

<script>
const electron = window.require("electron");

export default {
	name: 'FileHeader',
	props: {
		docsPath: {
			type: String,
			default: '',
			required: false
		},
		inputFile: {
			type: String,
			default: '',
			required: false
		}
	},
	methods: {
		open(e) {
			if (this.docsPath != '') {
				e.preventDefault();
				electron.shell.openExternal('https://swatplus.gitbook.io/docs/user/editor/inputs/' + this.docsPath);
			}
		}
	}
}
</script>