<template>
	<div>
		<b-input-group>
			<b-form-input type="text" :id="id" v-model="model" class="form-control" :required="required"></b-form-input>
			<b-input-group-append>
				<b-button variant="primary" type="button" @click="selectFile">Browse</b-button>
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
	name: 'SelectFileInput',
	props: {
		value: {
			type: String,
			required: false,
			default: ''
		},
		fileType: {
			type: String,
			required: true
		},
		required: {
			type: Boolean,
			default: false
		},
		invalidFeedback: {
			type: String,
			required: true
		},
		id: {
			type: String
		},
		saveDialog: {
			type: Boolean,
			default: false
		},
		defaultFileName: {
			type: String,
			required: false
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
		selectFile() {
			var filters;

			if (this.fileType == "json") {
				filters = [{ name: 'Json', extensions: ['json'] }];
			} else if (this.fileType == "sqlite") {
				filters = [{ name: 'SQLite', extensions: ['sqlite','db'] },{ name: 'All files', extensions: ['*'] }]
			} else if (this.fileType == "exe") {
				filters = [{ name: 'Executable', extensions: ['exe'] }];
			} else if (this.fileType == "csv") {
				filters = [{ name: 'CSV (Comma delimited)', extensions: ['csv'] }];
			} else {
				filters = [{ name: 'All files', extensions: ['*'] }]
			}

			var files;
			if (this.saveDialog) {
				files = dialog.showSaveDialogSync({filters: filters, defaultPath: this.defaultFileName});
			} else {
				files = dialog.showOpenDialogSync({filters: filters});
			}

			if (files !== undefined) {
				this.model = this.saveDialog ? files : files[0];
				this.$emit('update:model', this.model);
			}
		}
	}
}
</script>