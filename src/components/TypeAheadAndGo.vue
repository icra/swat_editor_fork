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
			<b-col :lg="btnCols" :xs="(btnCols + 1)" v-if="showButton">
				<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(model)" 
					@click="goToProp(model)" 
					v-b-tooltip.hover="'Click to view details. Warning: any unsaved changes on this page will be lost.'">
					<font-awesome-icon :icon="['fas', 'edit']" />
				</b-btn>
			</b-col>
		</b-row>
	</div>	
</template>

<script>
export default {
	name: 'TypeAheadAndGo',
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
		showButton: {
			type: Boolean,
			default: false
		},
		tableName: {
			type: String,
			required: true
		},
		routeName: {
			type: String,
			required: true
		},
		btnCols: {
			type: Number,
			default: 1
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
		},
		async goToProp(name) {
			if (!this.isNullOrEmpty(name)) {
				try {
					const response = await this.getAutoCompleteId(this.tableName, name);
					var id = response.data.id;
					
					this.$router.push({ name: this.routeName, params: { id: id }});
				} catch (error) {
					this.page.error = this.logError(error, `Cannot find ${name} in database table ${this.tableName}.`);
				}
			}
		}
	}
}
</script>