<template>
	<a :href="filePath" @click="open" :class="cssClass" :title="filePath">{{ text }}<slot></slot></a>
</template>

<script>
const electron = window.require("electron");

export default {
	name: 'OpenFile',
	props: {
		filePath: {
			type: String,
			default: null
		},
		text: {
			type: String,
			default: ''
		},
		cssClass: {
			type: String,
			required: false
		}
	},
	methods: {
		open(e) {
			e.preventDefault();
			if (!this.isNullOrEmpty(this.filePath)) electron.shell.openItem(this.filePath);
		}
	}
}
</script>