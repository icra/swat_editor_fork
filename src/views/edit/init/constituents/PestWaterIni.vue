<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="pest_water.ini" docs-path="initialization-data">
			Pesticides (Water)
		</file-header>

		<error-alert :text="page.saveError"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<b-alert :show="constituents.length < 1" variant="primary">
			You must first enable the <router-link to="/edit/init/constituents">constituents file</router-link> and add pesticides before editing this section.
		</b-alert>

		<div v-if="constituents.length > 0">
			<b-form @submit="save" :validated="page.validated">
				<b-table-simple responsive small table-class="edit border-bottom">
					<b-thead>
						<b-tr class="bg-light">
							<b-th></b-th>
							<b-th v-for="c in constituents" :key="c.id">{{c.name}}</b-th>
							<b-th></b-th>
						</b-tr>
					</b-thead>
					<b-tbody v-for="(item, i) in items" :key="i">
						<b-tr>
							<b-td>
								<b-form-input type="text" v-model="items[i].name" maxLength="16" placeholder="Enter a name for the initialization..." />
							</b-td>
							<b-th v-for="c in constituents" :key="c.id"></b-th>
							<b-td>
								<font-awesome-icon :icon="['fas', 'times']" class="text-danger pointer" @click="removeItem(item)" title="Delete" />
							</b-td>
						</b-tr>
						<b-tr>
							<b-td>Amount of pesticide in water at start of simulation (kg/ha)</b-td>
							<b-td v-for="(c, j) in constituents" :key="j">
								<b-form-input type="number" step="any" v-model.number="items[i].rows[j].water" maxLength="16" />
							</b-td>
							<b-td></b-td>
						</b-tr>
						<b-tr>
							<b-td>Amount of pesticide in the benthic zone at start of simulation (kg/ha)</b-td>
							<b-td v-for="(c, j) in constituents" :key="j">
								<b-form-input type="number" step="any" v-model.number="items[i].rows[j].benthic" maxLength="16" />
							</b-td>
							<b-td></b-td>
						</b-tr>
					</b-tbody>
				</b-table-simple>
			
				<action-bar>
					<save-button :saving="page.saving" />
					<b-button type="button" @click="addItem" variant="info" class="mr-1">Add Row</b-button>
					<back-button />
				</action-bar>
			</b-form>
		</div>
	</project-container>
</template>

<script>
export default {
	name: 'InitConstituentsPestWaterIni',
	data() {
		return {
			apiUrl: 'constituents/pest-water',
			relatedKey: 'pest_waters',
			page: {
				loading: false,
				error: null,
				validated: false,
				saving: false,
				saveError: null
			},
			items: [],
			constituents: []
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`${this.apiUrl}/${this.projectDbUrl}`);
				this.log(response.data);
				this.constituents = response.data.constituents;
				this.checkItems(response.data.items);
				this.log('items');
				this.log(this.items);

				if (this.items.length < 1) this.addItem();
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		},
		async save() {
			this.page.saveError = null;
			this.page.saving = true;
			this.page.validated = true;

			let items = this.items.filter(function(el) { return el.name !== undefined && el.name !== null && el.name !== '' });
			for (let item of items) {
				item.name = this.validName(item.name);
			}

			if (items.length < 1) {
				this.page.saveError = 'Please add at least one item below.';
			} else {
				try {
					const response = await this.$http.put(`${this.apiUrl}/${this.projectDbUrl}`, { 'items': items });
					this.page.validated = false;
					await this.get();
					this.$bvToast.show('changes-saved');
				} catch (error) {
					this.page.saveError = this.logError(error, 'Unable to save changes to database.');
				}
			}
			
			this.page.saving = false;
		},
		addItem() {
			let item = {
				name: null,
				rows: []
			};
			item = this.addEmptyRows(item);
			this.items.push(item);
		},
		addEmptyRows(item) {
			item.rows = [];
			for (let c of this.constituents) {
				item.rows.push({
					name_id: c.id,
					water: 0,
					benthic: 0
				});
			}
			return item;
		},
		removeItem(item) {
			this.items.splice(this.items.indexOf(item), 1);
			if (this.items.length < 1) this.addItem();
		},
		checkItems(items) {
			this.items = [];
			for (let item of items) {
				let newItem = {
					name: item.name,
					rows: []
				}

				if (item[this.relatedKey].length < 1) {
					newItem = this.addEmptyRows(newItem);
				} else {
					for (let row of item[this.relatedKey]) {
						newItem.rows.push({
							name_id: row.name,
							water: row.water,
							benthic: row.benthic
						});
					}

					let i = 0;
					for (let c of this.constituents) {
						let matches = newItem.rows.filter(function(el) { return el.name_id === c.id });
						if (matches.length < 1) {
							let newRow = {
								name_id: c.id,
								water: 0,
								benthic: 0
							};

							newItem.rows.splice(i, 0, newRow);
						}
						i++;
					}
				}

				this.items.push(newItem);
			}
		}
	}
}
</script>