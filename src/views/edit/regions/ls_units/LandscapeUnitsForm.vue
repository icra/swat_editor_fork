<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<b-row>
				<b-col>
					<b-form-group label="Name">
						<b-form-input type="text" v-model="item.name" required autofocus maxLength="16" 
							v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
					</b-form-group>
				</b-col>
				<b-col>
					<b-form-group label="Area (ha)">
						<b-form-input v-model.number="item.area" type="number" step="any" required />
					</b-form-group>
				</b-col>
			</b-row>

			<div v-if="isUpdate">
				<h2 class="my-3">Elements in this landscape unit</h2>
				<div v-if="item.elements.length < 1" class="alert alert-primary">
					This unit does not have any elements. 
				</div>
				<div v-else>
					<b-table striped responsive small table-class="border-bottom table-grid" :items="item.elements" :fields="fields" :sort-by.sync="sortBy">
						<template v-slot:cell(edit)="data">
							<router-link :to="'/edit/regions/ls_units/elements/edit/' + data.item.id" v-b-tooltip.hover.top="'Edit/View'">
								<font-awesome-icon :icon="['fas', 'edit']" />
							</router-link>
						</template>	
						<template v-slot:cell(obj_name)="data">
							<div v-if="data.item.obj_name != null">
								<router-link v-if="getObjTypeRoute(data.item) != '#'" :to="getObjTypeRoute(data.item)">{{ data.item.obj_name }}</router-link>
								<div v-else>{{ data.item.obj_name }}</div>
							</div>
						</template>
					</b-table>
				</div>
			</div>

			<action-bar>
				<save-button :saving="page.saving" />
				<b-button v-if="isUpdate" type="button" variant="info" class="mr-1" to="/edit/regions/ls_units/elements/create/">Add New Element</b-button>
				<back-button />
			</action-bar>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'SoilsForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			page: {
				error: null,
				validated: false,
				saving: false
			},
			fields: [
				{ key: 'edit', label: '', class: 'min' },
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'obj_typ', label: 'Type', sortable: true },
				{ key: 'obj_name', label: 'Object', sortable: true },
				{ key: 'bsn_frac', label: 'Basin Fraction', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(6) }},
				{ key: 'sub_frac', label: 'Subbasin Fraction', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(6) }},
				{ key: 'reg_frac', label: 'Region Fraction', sortable: true, class: 'text-right', formatter: (value) => { return Number(value).toFixed(6) }}
			],
			sortBy: 'name'
		}
	},
	methods: {
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put(`ls_units/${this.item.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`ls_units/post/${this.projectDbUrl}`, data);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;

			let item = {
				name: this.validName(this.item.name),
				area: this.item.area
			};

			if (this.isUpdate) {
				item.id = this.item.id;
			}
			
			try {
				const response = await this.putDb(item);

				if (this.isUpdate)
					this.$bvToast.show('changes-saved');
				else
					this.$router.push({ name: 'LandscapeUnits'});
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to save changes to database.');
			}

			this.page.saving = false;
			this.page.validated = false;
		}
	}
}
</script>