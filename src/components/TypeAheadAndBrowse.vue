<template>
	<div>
		<b-row no-gutters>
			<b-col>
				<type-ahead show-preview :required="required"
					v-model="model"
					:value="model"
					src=":keyword"
					:fetch="getNames"
					:getResponse="getDataResponse" />
			</b-col>
			<b-col :lg="btnCols" :xs="(btnCols + 1)">
				<router-link :to="`/table-browser?apiUrl=${apiUrl}&section=${section}&projectDb=${projectDbUrl}`" 
					v-b-tooltip.hover="'Browse table data in a new window'"
					target="_blank" class="d-block btn btn-primary ml-1">
					Browse
					<font-awesome-icon :icon="['fas', 'external-link-alt']" class="ml-1" />
				</router-link>
			</b-col>
		</b-row>
	</div>	
</template>

<script>
export default {
	name: 'TypeAheadAndBrowse',
	props: {
		value: {
			type: String,
			required: false,
			default: ''
		},
		required: {
			type: Boolean,
			default: false
		},
		tableName: {
			type: String,
			required: true
		},
		btnCols: {
			type: Number,
			default: 2
		},
		section: {
			type: String,
			required: true
		},
		apiUrl: {
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
		getNames(name) {
			return this.getAutoComplete(this.tableName, name);
		}
	}
}
</script>