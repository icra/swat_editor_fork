<template>
	<tr>
		<td v-if="bulkMode" class="text-center min">
			<b-form-checkbox v-model="varSelected"></b-form-checkbox>
		</td>
		<td v-if="showDatasets" :class="(datasetValue === value || (var_def.type === 'lookup' && datasetValue.name === value.name) ? 'text-info' : 'text-warning') + ' text-right min'">
			{{ var_def.type === 'lookup' ? datasetValue.name : datasetValue }}
		</td>
		<td class="field" :colspan="var_def.type === 'select' ? 2 : 1">
			<b-form-input v-if="var_def.type === 'float'" :required="required" v-model.number="model" type="number" step="any" :disabled="inputDisabled" />
			<b-form-input v-else-if="var_def.type === 'int'" :required="required" :id="id" v-model.number="model" type="number" :disabled="inputDisabled" />
			<b-form-select v-else-if="var_def.type === 'select'" v-model="model" :options="var_def.options" :disabled="inputDisabled" />
			<b-form-select v-else-if="var_def.type === 'lookup'" v-model="model.id" :options="lookupOptions" :disabled="inputDisabled" />
			<b-form-select v-else-if="var_def.type === 'bool'" v-model="model" :options="boolOptions" :disabled="inputDisabled" />
			<b-form-input v-else :required="false" v-model="model" type="text" class="form-control" :disabled="inputDisabled" />
		</td>
		<td class="units" v-if="var_def.type !== 'select'" v-html="writeUnits(var_def.units)"></td>
		<td>{{ var_def.description }}</td>
		<td class="code">{{ var_def.name }}</td>
		<td v-if="!showDatasets">{{ writeDefault(var_def) }}</td>
		<td v-if="show_range">
			<span v-if="var_def.min_value != var_def.max_value">
				{{ var_def.min_value }} - {{ var_def.max_value }}
			</span>
		</td>
	</tr>
</template>

<script>
export default {
	name: 'TrVarEditor',
	props: {
		value: {
			required: false
		},
		required: {
			type: Boolean,
			default: false
		},
		var_def: {
			type: Object,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		show_range: {
			type: Boolean,
			default: false
		},
		datasetValue: {
			required: false
		},
		showDatasets: {
			type: Boolean,
			default: false
		},
		bulkMode: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			model: this.value,
			lookupOptions: [],
			lookupError: null,
			boolOptions: [
				{ value: true, text: "Yes" },
				{ value: false, text: "No"}
			],
			varSelected: false
		}
	},
	async created() {
		if (this.var_def.type === 'lookup') {
			await this.get();
		}
	},
	watch: {
		value(value) {
			this.model = this.model !== value ? value : this.model;
		},
		model(value) {
			this.$emit('input', value);
		},
		varSelected(value) {
			let data = {
				name: this.var_def.name,
				value: value
			};
			this.$emit('change', data);
		}
	},
	methods: {
		async get() {
			try {
				const response = await this.$http.get(`selectlist/${this.var_def.default_text}/${this.projectDbUrl}`);

				this.lookupOptions = response.data;
			} catch (error) {
				this.lookupError = this.logError(error, 'Unable to get ' + this.var_def.default_text + ' options from database.');
			}
		},
		writeUnits(value) {
            if (!this.isNullOrEmpty(value) && value.includes("^")) {
				return value.replace(/\^\{(.*?)\}/g, "<sup>$1</sup>");
            }

            return value;
        },
        writeDefault(value) {
			if (value.type == 'lookup')
				return '';
            else if (value.default_text)
                return value.default_text;
            else
                return value.default_value;
		}
	},
	computed: {
		inputDisabled() {
			return this.bulkMode && !this.varSelected;
		}
	}
}
</script>