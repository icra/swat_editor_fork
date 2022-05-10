<template>
	<a :href="url" @click="open" :class="cssClass" :title="url">{{ text }}</a>
</template>

<script>
const electron = window.require("electron");

export default {
	name: 'OpenInBrowser',
	props: {
		url: {
			type: String,
			required: true
		},
		text: {
			type: String,
			required: true
		},
		cssClass: {
			type: String,
			required: false
		}
	},
	methods: {
		open(e) {
			e.preventDefault();
			electron.shell.openExternal(this.url);
		}
	}
}
</script>