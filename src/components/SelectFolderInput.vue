<template>
	<div>
		<b-input-group>
			<b-form-input type="text" :id="id" v-model="model" class="form-control" :required="required"></b-form-input>
			<b-input-group-append>
				<b-button variant="primary" type="button" @click="selectDirectory">Browse</b-button>
			</b-input-group-append>
		</b-input-group>

		<div class="invalid-feedback">
			{{invalidFeedback}}
		</div>
	</div>
</template>

<script>
const remote = window.require('electron').remote;
const dialog = remote.dialog;
const path = window.require('path');

export default {
	name: 'SelectFolderInput',
	props: {
		value: {
			type: String,
			required: false,
			default: ''
		},
		required: {
			type: Boolean,
			required: false
		},
		invalidFeedback: {
			type: String,
			required: true
		},
		id: {
			type: String
		}
	},
	data() {
		return {
			model: this.value
		}
	},
	watch: {
		value(value) {
			this.model = this.model !== value ? value : this.model;
		},
		model(value) {
			this.$emit('input', value);
		}
	},
	methods: {
		selectDirectory() {
			var files = dialog.showOpenDialogSync({properties: ['openDirectory']});
			if (files !== undefined) {
				this.model = files[0];
				this.$emit('update:model', this.model);
			}
		}
	}
}
</script>