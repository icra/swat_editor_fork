<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header :input-file="item.file_name" docs-path="decision-tables">
			<router-link :to="'/edit/decision_table/' + linkBack">Decision Tables</router-link>
			/ Edit
		</file-header>

		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		

		<error-alert :text="page.saveError"></error-alert>
		
		<b-form :validated="page.validated" @submit.prevent="save">
			<b-form-group label="Name">
				<b-form-input type="text" v-model="item.name" required autofocus maxLength="16" :disabled="notEditable"
					v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-form-group label="Description">
				<b-form-input type="text" v-model="item.description" :disabled="notEditable" />
			</b-form-group>

			<b-tabs v-model="page.tabIndex" content-class="mt-3">
				<b-tab title="Description">
					<div class="tab-container">
						<b-list-group>
							<b-list-group-item v-for="(d, i) in descriptions" :key="i" class="bg-light">
								If {{d.conditions.join(' and ')}} then {{d.actions.join(' and ')}}
							</b-list-group-item>
						</b-list-group>

						<hr class="my-4" />

						<div v-if="item.management_sch_auto_set && item.management_sch_auto_set.length > 0">
							<p class="mb-0">
								We recommend editing this table using the <router-link to="/edit/lum/mgt">management schedule builder</router-link>. 
								This table is used in the following management schedules:
							</p>
							<ul v-for="sch in item.management_sch_auto_set" :key="sch.id">
								<li><router-link :to="`/edit/lum/mgt/edit/${sch.management_sch.id}`">{{sch.management_sch.name}}</router-link></li>
							</ul>
						</div>
						<div v-else-if="item.reservoir_res_set && item.reservoir_res_set.length > 0">
							<p class="mb-0">This table is used in the following reservoirs:</p>
							<ul v-for="res in item.reservoir_res_set" :key="res.id">
								<li><router-link :to="`/edit/reservoirs/edit/${res.id}`">{{res.name}}</router-link></li>
							</ul>
						</div>
						<div v-else-if="item.wetland_wet_set && item.wetland_wet_set.length > 0">
							<p class="mb-0">This table is used in the following wetlands:</p>
							<ul v-for="res in item.wetland_wet_set" :key="res.id">
								<li><router-link :to="`/edit/reservoirs/wetlands/edit/${res.id}`">{{res.name}}</router-link></li>
							</ul>
						</div>
						<div v-else-if="item.hru_lte_hru_set && item.hru_lte_hru_set.length > 0">
							<p class="mb-0">This table is used in the following HRUs:</p>
							<ul v-for="hru in item.hru_lte_hru_set" :key="hru.id">
								<li><router-link :to="`/edit/hrus-lte/edit/${hru.id}`">{{hru.name}}</router-link></li>
							</ul>
						</div>
						<div v-else>
							<p>
								This table isn't being using in your project. 
								<span v-if="item.file_name === 'lum.dtl'">
									Use the <router-link to="/edit/lum/mgt">management schedule builder</router-link> to include and/or edit this table.
								</span>
							</p>
						</div>
					</div>
				</b-tab>
				<b-tab :title="notEditable ? 'Plain Text' : 'Advanced Editing'">
					<b-alert :show="notEditable && dbType === 'project'" variant="info">
						This decision table is reserved in the model and cannot be modified. 
						<br />To change any values in this table, we recommend making a copy and editing the copy instead.
					</b-alert>
					<b-alert :show="notEditable && dbType === 'datasets'" variant="info">
						This decision table is located in your datasets library. Make a copy to add it to your project.
					</b-alert>

					<b-alert :show="!notEditable" variant="warning">
						Warning: advanced users only.
						If you are comfortable with the decision table format, you may edit in plain text below.
					</b-alert>

					<div class="tab-container">
						<div v-if="notEditable">
							<div>Conditions</div>
							<b-table striped responsive class="border-bottom mt-1" small
								:items="item.conditions" 
								:fields="conditionsFields">
								<template v-slot:cell(alts)="data">
									<span class="pr-3" v-for="(a, i) in data.item.alts" :key="i">{{a.alt}}</span>
								</template>
							</b-table>

							<div>Actions</div>
							<b-table striped responsive class="border-bottom mt-1" small
								:items="item.actions" 
								:fields="actionsFields">
								<template v-slot:cell(outcomes)="data">
									<span class="pr-3" v-for="(o, i) in data.item.outcomes" :key="i">{{o.outcome ? 'y': 'n'}}</span>
								</template>
							</b-table>
						</div>
						<div v-else>
							<b-textarea v-model="tabularItem" rows="15" class="code"></b-textarea>
						</div>
					</div>
				</b-tab>
			</b-tabs>					

			<action-bar>
				<save-button v-if="!notEditable && page.tabIndex === 1" :saving="page.saving" />
				<back-button />
				<b-button type="button" variant="info" class="ml-auto" @click="page.copy.show = true">Copy</b-button>
				<b-button v-if="!notEditable && !isUsed" type="button" variant="danger" class="ml-1" @click="page.delete.show = true">Delete</b-button>
			</action-bar>
		</b-form>

		<b-modal v-model="page.copy.show" size="lg" title="Copy Decision Table" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.copy.error"></error-alert>	

			<p>
                Would you like to make a copy of this table? Enter a name for the copy below. 
				<br /><span class="text-danger">CAUTION:</span> If the table name entered already exists in your project it will be overwritten.
            </p>

            <b-form-group label="Name of item copy">
                <b-form-input type="text" v-model="page.copy.name" required maxLength="16"  v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
            </b-form-group>

			<div slot="modal-footer">
				<save-button :saving="page.copy.saving" type="button" @click.native="copy" text="Copy"></save-button>
				<b-button type="button" variant="secondary" @click="page.copy.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.delete.show" centered size="md" title="Confirm delete" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.delete.error"></error-alert>

			<p>
				Are you sure you want to delete <strong>{{item.name}}</strong>?
				This action is permanent and cannot be undone. 
			</p>

			<div slot="modal-footer">
				<save-button type="button" :saving="page.delete.saving" @click.native="confirmDelete" text="Delete" variant="danger" />
				<b-button type="button" variant="secondary" @click="page.delete.show = false">Cancel</b-button>
			</div>
		</b-modal>
	</project-container>
</template>

<script>
export default {
	name: 'DecisionsEdit',
	data() {
		return {
			tableId: this.$route.params.id,
			dbType: this.$route.params.dbtype,
			page: {
				loading: false,
				error: null,
				validated: false,
				saving: false,
				saveError: null,
                copy: {
                    show: false,
                    error: null,
                    saving: false,
                    name: null
                },
				tabIndex: 0,
				delete: {
					show: false,
					error: null,
					saving: false
				}
			},
			reservedTables: ['pl_hv_summer1', 'pl_hv_summer2', 'pl_hv_winter1'],
			item: {},
			tabularItem: '',
			linkBack: null,
			descriptions: [],
			conditionsFields: [
				{ key: 'var' },
				{ key: 'obj' },
				{ key: 'obj_num' },
				{ key: 'lim_var' },
				{ key: 'lim_op' },
				{ key: 'lim_const' },
				{ key: 'alts' },
			],
			actionsFields: [
				{ key: 'act_typ' },
				{ key: 'obj' },
				{ key: 'obj_num' },
				{ key: 'name' },
				{ key: 'option' },
				{ key: 'const' },
				{ key: 'const2' },
				{ key: 'fp' },
				{ key: 'outcomes' },
			],
			definitions: {
				conditions: {
					'w_stress': 'water stress',
					'n_stress': 'nitrogen stress',
					'phu_plant': 'potential heat units (plant based)',
					'phu_base0': 'potential heat units (base zero)',
					'plant_gro': 'plants growing',
					'days_harv': 'days since last harvest',
					'day_start': 'days since last harvest',
					'soil_water': 'soil water',
					'jday': 'julian day',
					'month': 'month',
					'year_rot': 'rotation year',
					'year_gro': 'growth year of perennials',
					'year_cal': 'calendar year',
					'year_seq': 'sequential year of simulation',
					'prob': 'probability',
					'tile_flo': 'tile flow',
					'aqu_dep': 'aquifer depth below surface',
					'land_use': 'land use and management',
					'ch_use': 'channel management',
					'vol': 'reservoir volume',
					'vol_wet': 'wetland volume (stored on an hru)'
				},
				actions: {
					'harvest': 'harvest',
					'harvest_kill': 'harvest and kill',
					'till': 'tillage',
					'irrigate': 'irrigate',
					'fertilize': 'fertilize',
					'pest_apply': 'apply pesticide',
					'burn': 'burn',
					'release': 'release',
					'lu_change': 'land use change',
					'plant': 'plant',
					'kill': 'kill',
					'rot_reset': 'reset rotation year',
					'grow_init': 'initiate growing season for hru_lte',
					'grow_end': 'end growing season for hru_lte',
					'drain_control': 'drainage water management',
					'flow_control': 'tile flow control for saturated buffers',
					'chan_change': 'channel change',
					'graze': 'graze'
				}
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		setTabularItem() {
			let int_pad = 10;
			let str_pad = 18;
			let flo_pad = 14;

			let tableDescription = this.isNullOrEmpty(this.item.description) ? '' : `     !${this.item.description}`;

			this.tabularItem = 'name'.padEnd(str_pad, ' ')
				+ 'conds'.padStart(int_pad, ' ')
				+ 'alts'.padStart(int_pad, ' ')
				+ 'acts'.padStart(int_pad, ' ') + tableDescription + '\n';

			let numAlts = this.item.conditions.length > 0 ? this.item.conditions[0].alts.length : 0;

			this.tabularItem += this.item.name.padEnd(str_pad, ' ')
				+ `${this.item.conditions.length}`.padStart(int_pad, ' ')
				+ `${numAlts}`.padStart(int_pad, ' ')
				+ `${this.item.actions.length}`.padStart(int_pad, ' ') + '\n';

			this.tabularItem += 'var'.padEnd(str_pad, ' ')
				+ 'obj'.padStart(int_pad, ' ')
				+ 'obj_num'.padStart(int_pad, ' ')
				+ 'lim_var'.padStart(str_pad, ' ')
				+ 'lim_op'.padStart(str_pad, ' ')
				+ 'lim_const'.padStart(flo_pad, ' ');

			for (let i = 0; i < numAlts; i++) {
				this.tabularItem += `alt${i+1}`.padStart(int_pad, ' ');
			}
			this.tabularItem += '\n';

			for (let c of this.item.conditions) {
				this.tabularItem += `${c.var}`.padEnd(str_pad, ' ')
					+ `${c.obj}`.padStart(int_pad, ' ')
					+ `${c.obj_num}`.padStart(int_pad, ' ')
					+ `${c.lim_var}`.padStart(str_pad, ' ')
					+ `${c.lim_op}`.padStart(str_pad, ' ')
					+ `${c.lim_const}`.padStart(flo_pad, ' ');

				for (let a of c.alts) {
					this.tabularItem += `${a.alt}`.padStart(int_pad, ' ');
				}

				let cd = this.isNullOrEmpty(c.description) ? '' : `     !${c.description}`;
				this.tabularItem += cd + '\n';
			}

			this.tabularItem += 'act_typ'.padEnd(str_pad, ' ')
				+ 'obj'.padStart(int_pad, ' ')
				+ 'obj_num'.padStart(int_pad, ' ')
				+ 'name'.padStart(str_pad, ' ')
				+ 'option'.padStart(str_pad, ' ')
				+ 'const'.padStart(flo_pad, ' ')
				+ 'const2'.padStart(flo_pad, ' ')
				+ 'fp'.padStart(str_pad, ' ')
				+ 'outcome'.padStart(9, ' ') + '\n';

			for (let a of this.item.actions) {
				this.tabularItem += `${a.act_typ}`.padEnd(str_pad, ' ')
					+ `${a.obj}`.padStart(int_pad, ' ')
					+ `${a.obj_num}`.padStart(int_pad, ' ')
					+ `${a.name}`.padStart(str_pad, ' ')
					+ `${a.option}`.padStart(str_pad, ' ')
					+ `${a.const}`.padStart(flo_pad, ' ')
					+ `${a.const2}`.padStart(flo_pad, ' ')
					+ `${a.fp}`.padStart(str_pad, ' ');

				for (let o of a.outcomes) {
					let ostr = o.outcome ? 'y' : 'n'
					this.tabularItem += `${ostr}`.padStart(3, ' ');
				}

				this.tabularItem += '\n';
			}
		},
		async get() {
			this.tableId = this.$route.params.id;
			this.dbType = this.$route.params.dbtype;
			this.page.loading = true;
			this.page.error = null;

            try {
				let route = `decision_table/${this.$route.params.id}/${this.projectDbUrl}`;
				if (this.dbType === 'datasets') route = `decision_table_datasets/${this.$route.params.id}/${this.datasetsDbUrl}`;

				const response = await this.$http.get(route);
				this.log(response);
				this.item = response.data;
				this.log(this.item);
				this.linkBack = this.item.file_name.split('.')[0];

				if (this.dbType === 'datasets') this.page.copy.name = this.item.name;
				else this.page.copy.name = this.item.name + '_copy';

				this.setTabularItem();

				if (this.item.conditions.length > 0) {
					for (let c of this.item.conditions) {
						for (let i = 0; i < c.alts.length; i++) {
							if (i >= this.descriptions.length) {
								this.descriptions.push({conditions: [], actions: []});
							}

							if (c.alts[i].alt != '-') {
								let varText = c.var;
								if (c.var in this.definitions.conditions) {
									varText = this.definitions.conditions[c.var];
								}

								let item = varText + ' ' + c.alts[i].alt + ' ';
								if (!this.isNullOrEmpty(c.lim_var, true)) {
									item += c.lim_var + ' ';
									if (c.lim_op != '-') {
										item += c.lim_op + ' ' + c.lim_const;
									} else if (c.lim_const != 0) {
										item += ' ' + c.lim_const;
									}
								}
								else {
									item += c.lim_const;
								}

								this.descriptions[i].conditions.push(item);
							}
						}
					}

					for (let a of this.item.actions) {
						for (let i = 0; i < a.outcomes.length; i++) {
							if (a.outcomes[i].outcome) {
								let varText = a.act_typ;
								if (a.act_typ in this.definitions.actions) {
									varText = this.definitions.actions[a.act_typ];
								}

								let item = varText + ' ';
								if (!this.isNullOrEmpty(a.option, true)) {
									item += a.option + ' ';
								}
								item += '(' + a.name + ')';

								if (i < this.descriptions.length) {
									this.descriptions[i].actions.push(item);
								}							
							}
						}
					}
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Error loading decision table.');
			}

			this.page.loading = false;
		},
		async save() {
			this.page.saveError = null;
            this.page.saving = true;

			if (this.isNullOrEmpty(this.item.name)) {
                this.page.saveError = 'Please enter a name.';
            } else {
				try {
					if (this.page.tabIndex === 1) { //Tabular
						let data = {
							name: this.validName(this.item.name),
							description: this.item.description,
							file_name: this.item.file_name,
							text: this.tabularItem
						};

						const response = await this.$http.put(`decision_table/text/${this.tableId}/${this.projectDbUrl}`, data);
						this.log(response);
						this.$bvToast.show('changes-saved');
					}
				} catch (error) {
					this.page.saveError = this.logError(error, 'Unable to save changes to database.');
				}
			}

			this.page.saving = false;
		},
        async copy() {
            this.page.copy.error = null;
            this.page.copy.saving = true;

            if (this.isNullOrEmpty(this.page.copy.name)) {
                this.page.copy.error = 'Please enter a name.';
            } else {
                try {
                    let item = this.item;
                    item.id = null;
                    item.name = this.validName(this.page.copy.name);

                    const response = await this.$http.post(`decision_table/post/${this.projectDbUrl}`, item);
					this.log(response);
					this.$router.push({ name: 'DecisionsEdit', params: { id: response.data.id, dbtype: 'project' } });
					this.page.copy.show = false;
                } catch (error) {
                    this.page.copy.error = this.logError(error, 'Unable to save changes to database.');
                }
            }
            
            this.page.copy.saving = false;
        },
		async confirmDelete() {
			this.page.delete.error = null;
			this.page.delete.saving = true;

			if (this.notEditable()) {
				this.page.delete.error = 'This table cannot be deleted.';
			} else {
				try {
					const response = await this.$http.delete(`decision_table/${this.$route.params.id}/${this.projectDbUrl}`);
					this.log(response);
					this.page.delete.show = false;
					this.$router.push({ path: '/edit/decision_table/' + this.linkBack });
				} catch (error) {
					this.page.delete.error = this.logError(error, 'Unable to delete from database.');
				}
			}

			this.page.delete.saving = false;
		}
	},
	computed: {
		notEditable() {
			return this.reservedTables.includes(this.item.name) || this.dbType === 'datasets';
		},
		isUsed() {
			return (this.item.management_sch_auto_set && this.item.management_sch_auto_set.length > 0) ||
				(this.item.reservoir_res_set && this.item.reservoir_res_set.length > 0) ||
				(this.item.wetland_wet_set && this.item.wetland_wet_set.length > 0) ||
				(this.item.hru_lte_hru_set && this.item.hru_lte_hru_set.length > 0);
		}
	}
}
</script>