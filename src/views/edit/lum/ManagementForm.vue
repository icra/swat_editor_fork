<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<page-loading :loading="page.loading"></page-loading>
		<b-form :validated="page.validated" @submit.prevent="save" v-if="!page.loading">
			<b-form-group label="Schedule name" label-for="name" class="mb-4">
				<b-form-input id="name" type="text" v-model="form.name" required autofocus maxLength="16" 
					v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-tabs v-model="page.tabIndex" content-class="mt-3">
				<b-tab title="Schedule Builder">
					<div class="tab-container">
						<b-alert variant="warning" :show="!isNullOrEmpty(data.builder.warning)">
							{{data.builder.warning}}
						</b-alert>
						<div v-if="isNullOrEmpty(data.builder.warning)">
							<p>
								Use the schedule builder below to apply land use decision tables built by the SWAT+ development 
								team. These tables are designed cover most use cases, but if you have a complex need, please 
								<open-in-browser url="https://swat.tamu.edu/contact/" text="contact us directly" />
								and we can work with you to build a custom table.
							</p>

							<b-alert variant="warning" :show="form.operations.length > 0">
								You have manual operations defined for this schedule and should use the advanced tab to modify them.
							</b-alert>

							<h3>Decision tables used in this management schedule</h3>
							<div>
								<draggable class="list-group" element="ul" v-model="form.auto_ops">
									<li class="list-group-item bg-light d-flex justify-content-between align-items-center" v-for="element in form.auto_ops" :key="element.name">
										<font-awesome-icon :icon="['fas', 'edit']" class="mr-2 text-primary pointer" @click="getBuilderTable(element)" v-b-tooltip.hover.right="commonMessages.leaveWarning" />
										{{autoOpDescription(element)}} {{autoOpPlantLabel(element)}}
										<font-awesome-icon :icon="['fas', 'times']" class="ml-auto text-danger pointer" @click="removeAutoOp(element)" v-b-tooltip.hover.right="'Delete'" />
									</li>
								</draggable>
							</div>

							<h3 class="mt-4">Add a decision table</h3>
							<div class="mb-3">
								<b-form-select v-model="data.builder.selections.type" :options="data.builder.typeOptions" @change="data.builder.selections.table=null"></b-form-select>
							</div>
							<div v-if="!isNullOrEmpty(data.builder.selections.type)">
								<b-form-select v-model="data.builder.selections.table" :options="builderTableOptions">
									<template #first>
										<b-form-select-option :value="null">Select {{builderTableNullLabel}}...</b-form-select-option>
									</template>
								</b-form-select>

								<div class="my-3" v-if="data.builder.selections.table === 'waterStress'">
									<b-form-select v-model="data.builder.selections.irrigation" :options="data.builder.irrWaterStressSources" @change="data.builder.selections.irrigation2 = null">
										<template #first>
											<b-form-select-option :value="null">Select primary source...</b-form-select-option>
										</template>
									</b-form-select>

									<div class="my-3" v-if="['waterStressRes','waterStressAqu'].includes(data.builder.selections.irrigation)">
										<b-form-select v-model="data.builder.selections.irrigation2" 
											:options="data.builder.selections.irrigation === 'waterStressRes' ? data.builder.irrWaterStressRes : data.builder.irrWaterStressAqu">
											<template #first>
												<b-form-select-option :value="null">Select backup source...</b-form-select-option>
											</template>
										</b-form-select>
									</div>

									<div class="mt-3" v-if="!isNullOrEmpty(data.builder.selections.irrigation2) || ['irr_str8_unlim','irr_str8_cha'].includes(data.builder.selections.irrigation)">
										<b-btn variant="primary" @click="configureBuilderTable">Configure &amp; Add</b-btn>
									</div>
								</div>
								<div class="my-3" v-else-if="!isNullOrEmpty(data.builder.selections.table)">
									<b-btn variant="primary" @click="configureBuilderTable">Configure &amp; Add</b-btn>
								</div>
							</div>
							
							<b-modal v-model="data.builder.modal.show" size="lg" :title="`Configure: ${data.builder.modal.op.description}`" scrollable no-close-on-backdrop no-close-on-esc hide-header-close>
								<page-loading :loading="data.builder.modal.loading"></page-loading>
								<div v-if="!data.builder.modal.loading">
									<b-alert variant="danger" :show="!isNullOrEmpty(data.builder.modal.error)">
										{{data.builder.modal.error}}
									</b-alert>

									<b-form style="min-height:300px">
										<div v-if="!isNullOrEmpty(data.builder.modal.op.name) && data.builder.modal.op.name.startsWith('pl_hv_')">
											<div v-if="reserved_d_table_array.includes(data.builder.modal.op.name)">
												<b-form-group label-for="builder_op_plant1" class="mt-3">
													<template slot="label">
														Plant
														<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="builder_op_plant1_pop" />
													</template>
													<b-popover target="builder_op_plant1_pop" triggers="hover focus">
														<reference-label section="Databases / Plants" file="plants.plt" db="plants_plt" api-url="db/plants" />
													</b-popover>

													<type-ahead-and-browse :required="false"
														v-model="data.builder.modal.op.plant1"
														:value="data.builder.modal.op.plant1"
														table-name="plant" 
														section="Databases / Plants" api-url="db/plants"></type-ahead-and-browse>
												</b-form-group>

												<b-form-group v-if="data.builder.modal.op.name === data.reserved_d_tables.summer2" label-for="builder_op_plant2" class="mt-3">
													<template slot="label">
														Plant 2
														<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="builder_op_plant2_pop" />
													</template>
													<b-popover target="builder_op_plant2_pop" triggers="hover focus">
														<reference-label section="Databases / Plants" file="plants.plt" db="plants_plt" api-url="db/plants" />
													</b-popover>

													<type-ahead id="builder_op_plant2" :required="false" show-preview
																v-model="data.builder.modal.op.plant2"
																:value="data.builder.modal.op.plant2"
																src=":keyword"
																:fetch="getPlantsAutoOps"
																:getResponse="getDataResponse" />
												</b-form-group>
											</div>
											
											<b-form-checkbox v-model="data.builder.modal.op.saveAsNew">Edit heat units?</b-form-checkbox>
											<div v-if="data.builder.modal.op.saveAsNew">
												<table class="table edit border-bottom mt-3">
													<thead class="thead-light">
														<tr><th colspan="2">Conditions to trigger table</th></tr>
													</thead>
													<tbody>
														<tr v-for="cond in validCropRotationConditions" :key="cond.id">
															<td class="field">
																<b-form-input required v-model.number="cond.lim_const" type="number" step="any" />
															</td>
															<td>{{cond.description}}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										<div v-else-if="isBuilderTableIn('irrigation') || isBuilderTableIn('irrWaterStressSources') || isBuilderTableIn('irrWaterStressRes') || isBuilderTableIn('irrWaterStressAqu')">
											<table class="table edit mb-0">
												<thead class="thead-light">
													<tr><th colspan="2">Conditions to trigger table</th></tr>
												</thead>
												<tbody>
													<tr v-for="cond in validIrrigationConditions" :key="cond.id">
														<td class="field">
															<b-form-select v-if="['aqu', 'res', 'cha'].includes(cond.obj)" class="mb-1"
																v-model="cond.obj_num" 
																:options="cond.obj === 'aqu' ? data.aquifers : (cond.obj === 'res' ? data.reservoirs : data.channels)"
																@change="setActionObjNumFromCond(cond.obj_num,cond.obj)">
																<template #first>
																	<b-form-select-option :value="0">Select...</b-form-select-option>
																</template>
															</b-form-select>
															<b-form-input required v-model.number="cond.lim_const" type="number" step="any" />
														</td>
														<td>
															{{cond.description}}
															<div class="text-danger" v-if="cond.obj === 'res' && data.reservoirs.length < 1">
																Your project does not contain any reservoirs. You should select a different table.
															</div>
														</td>
													</tr>
												</tbody>
											</table>
											<table class="table edit mb-0" v-for="act in validIrrigationActions" :key="act.id">
												<thead class="thead-light">
													<tr><th colspan="2">{{act.obj === 'aqu' ? 'Aquifer' : (act.obj === 'res' ? 'Reservoir' : (act.obj === 'cha' ? 'Channel' : 'Unlimited'))}} source action values</th></tr>
												</thead>
												<tbody>
													<tr v-if="['aqu', 'res', 'cha'].includes(act.obj)">
														<td class="field">
															<b-form-select v-model="act.obj_num" :options="act.obj === 'aqu' ? data.aquifers : (act.obj === 'res' ? data.reservoirs : data.channels)">
																<template #first>
																	<b-form-select-option :value="0">Select...</b-form-select-option>
																</template>
															</b-form-select>
														</td>
														<td>
															{{act.obj === 'aqu' ? 'aquifer' : (act.obj === 'res' ? 'reservoir' : 'channel')}}
															<div class="text-danger" v-if="act.obj === 'res' && data.reservoirs.length < 1">
																Your project does not contain any reservoirs. You should select a different table.
															</div>
														</td>
													</tr>
													<tr>
														<td class="field">
															<b-form-input required v-model.number="act.const" type="number" step="any" />
														</td>
														<td>irrigation amount (mm)</td>
													</tr>
													<tr>
														<td class="field">
															<b-form-input required v-model.number="act.const2" type="number" step="any" />
														</td>
														<td>maximum times per year to irrigate using sprinkler</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div v-else-if="isBuilderTableIn('fertilizer')">
											<table class="table edit mb-0">
												<thead class="thead-light">
													<tr><th colspan="2">Conditions to trigger table</th></tr>
												</thead>
												<tbody>
													<tr v-for="cond in validFertilizerConditions" :key="cond.id">
														<td class="field">
															<b-form-input required v-model.number="cond.lim_const" type="number" step="any" />
														</td>
														<td>{{cond.description}}</td>
													</tr>
												</tbody>
											</table>
											<table class="table edit mb-0" v-for="(act, a) in validFertilizerActions" :key="act.heading">
												<thead class="thead-light">
													<tr><th colspan="2">Action: {{act.heading}}</th></tr>
												</thead>
												<tbody style="border-top:0">
													<tr>
														<td class="field">
															<b-form-select v-model="act.action.option" :options="data.fertilizers" />
														</td>
														<td>
															fertilizer
															<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" :id="`builder_act_fert_pop_${a}`" />
															<b-popover :target="`builder_act_fert_pop_${a}`" triggers="hover focus">
																<reference-label section="Databases / Fertilizer" file="fertilizer.frt" db="fertilizer_frt" api-url="db/fertilizer" />
															</b-popover>
														</td>
													</tr>
													<tr>
														<td class="field">
															<b-form-input required v-model.number="act.action.const" type="number" step="any" />
														</td>
														<td>fertilizer amount (kg/ha)</td>
													</tr>
													<tr>
														<td class="field">
															<b-form-input required v-model.number="act.action.const2" type="number" step="any" />
														</td>
														<td>maximum times per year to fertilize</td>
													</tr>
													<tr>
														<td class="field">
															<b-form-select v-model="act.action.fp" :options="data.chem_apps" />
														</td>
														<td>
															application
															<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" :id="`builder_act_app_pop_${a}`" />
															<b-popover :target="`builder_act_app_pop_${a}`" triggers="hover focus">
																<reference-label section="Operations / Chemical Applications" file="chem_app.ops" db="chem_app_ops" api-url="ops/chemapp" />
															</b-popover>
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div v-else-if="!isNullOrEmpty(data.builder.modal.op.table)">
											<table class="table edit border-bottom">
												<thead class="thead-light">
													<tr><th colspan="2">Conditions to trigger table</th></tr>
												</thead>
												<tbody>
													<tr v-for="cond in data.builder.modal.op.table.conditions" :key="cond.id">
														<td class="field">
															<b-form-input required v-model.number="cond.lim_const" type="number" step="any" />
														</td>
														<td>{{cond.description}}</td>
													</tr>
												</tbody>
											</table>
										</div>
									</b-form>
								</div>
								
								<div slot="modal-footer">
									<b-button v-if="isNullOrEmpty(data.builder.modal.error) && !isNullOrEmpty(data.builder.modal.op.name) && data.builder.modal.op.name.startsWith('pl_hv_') && !data.builder.modal.op.saveAsNew" 
										type="button" variant="primary" @click="saveBuilderTable(true)" :disabled="data.builder.modal.saving" class="mr-1">
										<font-awesome-icon v-if="data.builder.modal.saving" :icon="['fas', 'spinner']" spin />
										Save
									</b-button>
									<b-dropdown v-else-if="isNullOrEmpty(data.builder.modal.error)" dropup right variant="primary" class="mr-1" :disabled="data.builder.modal.saving">
										<template #button-content>
											<font-awesome-icon v-if="data.builder.modal.saving" :icon="['fas', 'spinner']" spin />
											Save...
										</template>
										<b-dropdown-item @click="saveBuilderTable(true)">Save changes for all uses of this table</b-dropdown-item>
										<b-dropdown-item @click="saveBuilderTable(false)">Save changes for only this schedule (makes a new copy)</b-dropdown-item>
									</b-dropdown>
									<b-button type="button" variant="secondary" @click="cancelBuilderTable">Cancel</b-button>
								</div>
							</b-modal>
						</div>
					</div>
				</b-tab>
				<b-tab title="Advanced">
					<div class="tab-container">
						<p>
							For most users we recommend using the schedule builder tab to select from decision tables
							built and tested by the model team. Advanced users can select automatic schedules below or enter 
							manual operations.
						</p>
						<b-row class="mb-4">
							<b-col sm="5">
								<h3 class="mb-3">Automatic schedules</h3>
								<div v-if="form.auto_ops.length > 0">
									<p v-if="form.auto_ops.length > 1">Drag and drop items to sort</p>
									<div>
										<draggable class="list-group" element="ul" v-model="form.auto_ops">
											<li class="list-group-item bg-light d-flex justify-content-between align-items-center" v-for="element in form.auto_ops" :key="element.name">
												<font-awesome-icon :icon="['fas', 'edit']" class="mr-2 text-primary pointer" @click="goToAutoOp(element.name)" v-b-tooltip.hover.right="commonMessages.leaveWarning" />
												{{element.name}} {{autoOpPlantLabel(element)}}
												<font-awesome-icon :icon="['fas', 'times']" class="ml-auto text-danger pointer" @click="removeAutoOp(element)" v-b-tooltip.hover.right="'Delete'" />
											</li>
										</draggable>
									</div>
								</div>

								<b-form-group label-for="grww_name" class="mt-3">
									<template slot="label">
										Add an automatic schedule
										<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="auto_op_pop" />
									</template>
									<b-popover target="auto_op_pop" triggers="hover focus">
										<reference-label section="Decision Tables / Land Use Management" file="lum.dtl" db="d_table_dtl" />
									</b-popover>

									<b-row no-gutters>
										<b-col>
											<type-ahead id="new_auto_op" :required="false" show-preview
												v-model="data.new_auto_op.name"
												:value="data.new_auto_op.name"
												src=":keyword"
												:fetch="getNamesAutoOps"
												:getResponse="getDataResponse" />
										</b-col>
										<b-col cols="2">
											<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(data.new_auto_op.name)" @click="addAutoOp">Add</b-btn>
										</b-col>
									</b-row>
								</b-form-group>

								<b-modal v-model="reservedTableModal.show" size="md" :title="'Specify plant for ' + data.new_auto_op.name" no-close-on-backdrop no-close-on-esc hide-header-close>
									<b-alert variant="danger" :show="reservedTableModal.error !== undefined">
										{{modal.error}}
									</b-alert>

									<b-form-group label-for="new_auto_op_plant1" class="mt-3">
										<template slot="label">
											Plant
											<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="plant1_pop" />
										</template>
										<b-popover target="plant1_pop" triggers="hover focus">
											<reference-label section="Databases / Plants" file="plants.plt" db="plants_plt" />
										</b-popover>

										<type-ahead id="new_auto_op_plant1" :required="false" show-preview
													v-model="data.new_auto_op.plant1"
													:value="data.new_auto_op.plant1"
													src=":keyword"
													:fetch="getPlantsAutoOps"
													:getResponse="getDataResponse" />
									</b-form-group>

									<b-form-group v-if="data.new_auto_op.name === data.reserved_d_tables.summer2" label-for="new_auto_op_plant2" class="mt-3">
										<template slot="label">
											Plant 2
											<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="plant2_pop" />
										</template>
										<b-popover target="plant2_pop" triggers="hover focus">
											<reference-label section="Databases / Plants" file="plants.plt" db="plants_plt" />
										</b-popover>

										<type-ahead id="new_auto_op_plant2" :required="false" show-preview
													v-model="data.new_auto_op.plant2"
													:value="data.new_auto_op.plant2"
													src=":keyword"
													:fetch="getPlantsAutoOps"
													:getResponse="getDataResponse" />
									</b-form-group>
									
									<div slot="modal-footer">
										<b-button type="button" variant="primary" @click="addReservedAutoOp" class="mr-1">
											Save
										</b-button>
										<b-button type="button" variant="secondary" @click="cancelReservedAutoOp">Cancel</b-button>
									</div>
								</b-modal>
							</b-col>
							<b-col sm="6" offset-sm="1">
								<h3 class="mb-3">Operations</h3>

								<div v-if="form.operations.length > 0">				
									<table class="table border-bottom table-grid table-sm">
										<thead>
											<tr class="bg-light">
												<th></th>
												<th>Operation</th>
												<th>Year</th>
												<th>Month</th>
												<th>Day</th>
												<th title="Heat Units">HU</th>
												<th colspan="3">Data</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="(op, i) in sortedOperations" :key="i">
												<td><font-awesome-icon :icon="['fas', 'edit']" class="text-primary pointer" @click="editOp(op)" v-b-tooltip.hover.right="'Edit'" /></td>
												<td>{{op.op_typ}}</td>
												<td>{{op.order}}</td>
												<td>{{op.mon}}</td>
												<td>{{op.day}}</td>
												<td>{{op.hu_sch}}</td>
												<td>{{op.op_data1}}</td>
												<td>{{op.op_data2}}</td>
												<td>{{op.op_data3}}</td>
												<td><font-awesome-icon :icon="['fas', 'times']" class="text-danger pointer" @click="removeOp(op)" v-b-tooltip.hover.right="'Delete'" /></td>
											</tr>
										</tbody>
									</table>

									<p>
										Operation sorting is done by year of rotation followed by heat units, then month/day if heat units = 0.
									</p>
								</div>
								<div>
									<b-btn variant="primary" @click="addOp">Add an operation</b-btn>
								</div>

								<b-modal ref="opModal" v-model="modal.show" size="lg" :title="(modal.new ? 'Add' : 'Edit') + ' Operation'" no-close-on-backdrop no-close-on-esc hide-header-close>
									<b-alert variant="danger" :show="modal.error !== undefined">
										{{modal.error}}
									</b-alert>

									<b-form>
										<b-form-group label="Operation" label-for="op_typ">
											<b-form-select id="op_typ" v-model="modal.operation.op_typ" :options="data.op_codes" @change="changeOp" />
										</b-form-group>

										<hr class="my-3" />

										<div>
											Operations can be scheduled by month/day or heat units. If no month/day, heat units should be > 0. 
										</div>

										<div v-if="modal.operation.op_typ == 'skip'">
											In order to sort your skip operation properly, enter a month/day or heat units accordingly. These values are not used in the model for skips and are for sorting only.
										</div>

										<b-row class="mt-3">
											<b-col>
												<b-form-group label="Year of Rotation" label-for="hu_sch">
													<input id="order" v-model="modal.operation.order" type="number" class="form-control" />
												</b-form-group>
											</b-col>
											<b-col>
												<b-form-group label="Month" label-for="mon">
													<b-form-select id="mon" v-model="modal.operation.mon" :options="data.months" />
												</b-form-group>
											</b-col>
											<b-col>
												<b-form-group label="Day" label-for="day">
													<b-form-select id="day" v-model="modal.operation.day" :options="data.days" />
												</b-form-group>
											</b-col>
											<b-col>
												<b-form-group label="Heat Units Fraction" label-for="hu_sch">
													<input id="op_dahu_schta3" v-model="modal.operation.hu_sch" type="number" step="any" class="form-control" min="0" max="1" />
												</b-form-group>
											</b-col>
										</b-row>

										<hr class="my-3" />

										<b-row v-if="modal.operation.op_typ != 'prtp' && modal.operation.op_typ != 'skip'">
											<b-col cols="6">
												<b-form-group label-for="op_data1">
													<template slot="label">
														{{data.op_data1.label}}
														<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="op_data1_pop" />
													</template>
													<b-popover target="op_data1_pop" triggers="hover focus">
														<reference-label :section="data.op_data1.section" :file="data.op_data1.file" :db="data.op_data1.db" />
													</b-popover>

													<b-row no-gutters>
														<b-col>
															<type-ahead id="op_data1" :required="false" show-preview
																v-model="modal.operation.op_data1"
																:value="modal.operation.op_data1"
																src=":keyword"
																:fetch="getNamesOpData1"
																:getResponse="getDataResponse" />
														</b-col>
														<b-col cols="1" v-if="!modal.new && false">
															<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(modal.operation.op_data1)"  @click="goToProp" v-b-tooltip.hover="commonMessages.leaveWarning"><font-awesome-icon :icon="['fas', 'edit']" /></b-btn>
														</b-col>
													</b-row>
												</b-form-group>
											</b-col>
											<b-col v-if="modal.operation.op_typ == 'harv' || modal.operation.op_typ == 'hvkl' || modal.operation.op_typ == 'fert' || modal.operation.op_typ == 'pest'">
												<b-form-group label-for="op_data2">
													<template slot="label">
														{{data.op_data2.label}}
														<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="op_data2_pop" />
													</template>
													<b-popover target="op_data2_pop" triggers="hover focus">
														<reference-label :section="data.op_data2.section" :file="data.op_data2.file" :db="data.op_data2.db" />
													</b-popover>

													<b-row no-gutters>
														<b-col>
															<type-ahead id="op_data2" :required="false" show-preview
																v-model="modal.operation.op_data2"
																:value="modal.operation.op_data2"
																src=":keyword"
																:fetch="getNamesOpData2"
																:getResponse="getDataResponse" />
														</b-col>
														<b-col cols="1" v-if="!modal.new && false">
															<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(modal.operation.op_data2)"  @click="goToProp" v-b-tooltip.hover="commonMessages.leaveWarning"><font-awesome-icon :icon="['fas', 'edit']" /></b-btn>
														</b-col>
													</b-row>
												</b-form-group>
											</b-col>
										</b-row>

										<b-row v-if="data.has_op_data3.includes(modal.operation.op_typ)">
											<b-col cols="6">
												<b-form-group :label="opData3Label" label-for="op_data3">
													<input id="op_data3" v-model="modal.operation.op_data3" type="number" step="any" class="form-control" />
												</b-form-group>
											</b-col>
										</b-row>
									</b-form>
									
									<div slot="modal-footer">
										<b-button type="button" variant="primary" @click="saveOp" :disabled="modal.saving" class="mr-1">
											<font-awesome-icon v-if="modal.saving" :icon="['fas', 'spinner']" spin />
											Save
										</b-button>
										<b-button type="button" variant="secondary" @click="cancel">Cancel</b-button>
									</div>
								</b-modal>
							</b-col>
						</b-row>
					</div>
				</b-tab>
			</b-tabs>

			<action-bar>
				<save-button :saving="page.saving" @click.native="page.validated = true" />
				<back-button />
			</action-bar>
		</b-form>
	</div>
</template>

<style>
.list-group-item {
  cursor: move;
}
</style>

<script>
import draggable from 'vuedraggable';

export default {
	name: 'ManagementForm',
	components: {
		draggable
	},
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
				loading: true,
				error: undefined,
				validated: false,
				saving: false,
				tabIndex: 0
			},
			form: {
				name: '',
				auto_ops: [],
				operations: []
			},
			data: {
				days: [
					{ value: 0, text: 'None (use heat units)' }
				],
				months: [
					{ value: 0, text: 'None (use heat units)' },
					{ value: 1, text: 'January' },
					{ value: 2, text: 'February' },
					{ value: 3, text: 'March' },
					{ value: 4, text: 'April' },
					{ value: 5, text: 'May' },
					{ value: 6, text: 'June' },
					{ value: 7, text: 'July' },
					{ value: 8, text: 'August' },
					{ value: 9, text: 'September' },
					{ value: 10, text: 'October' },
					{ value: 11, text: 'November' },
					{ value: 12, text: 'December' }
				],
				op_codes: [],
				new_auto_op: {
					name: '',
					plant1: '',
					plant2: ''
				},
				op_data1: {
					label: '',
					section: '',
					file: '',
					db: ''
				},
				op_data2: {
					label: '',
					section: '',
					file: '',
					db: ''
				},
				has_op_data3: ['fert', 'pest', 'graz', 'dwm'],
				reserved_d_tables: {
					summer1: 'pl_hv_summer1',
					summer2: 'pl_hv_summer2',
					winter1: 'pl_hv_winter1'
				},
				fertilizers: [],
				chem_apps: [],
				aquifers: [],
				channels: [],
				reservoirs: [],
				builder: {
					defaults: {},
					warning: null,
					selections: {
						type: null,
						table: null,
						description: null,
						irrigation: null,
						irrigation2: null
					},
					modal: {
						loading: false,
						show: false,
						validate: false,
						saving: false,
						error: undefined,

						new: false,
						editIndex: null,
						op: {
							name: null,
							description: null,
							plant1: null,
							plant2: null,
							table: null,
							saveAsNew: false
						}
					},
					typeOptions: [
						{ value: null, text: 'Select the type of operation...' },
          				{ value: 'cropRotation', text: 'crop rotation' },
						{ value: 'tillage', text: 'tillage' },
						{ value: 'fertilizer', text: 'fertilizer' },
						{ value: 'irrigation', text: 'irrigation' },
						{ value: 'grazing', text: 'grazing' },
						{ value: 'hayForestCutting', text: 'hay and forest cutting' }
					],
					tables: {
						cropRotation: [
							{ value: 'pl_hv_summer1', text: 'plant and harvest for continuous summer crop' },
							{ value: 'pl_hv_summer2', text: 'plant and harvest for 2 year summer crop rotation' },
							{ value: 'pl_hv_winter1', text: 'plant and harvest for continuous winter crop' },
							{ value: 'pl_hv_ccsws', text: 'corn-corn-soybean-winter wheat-soybean rotation' }
						],
						tillage: [
							{ value: 'fall_plow', text: 'fall plow followed by field cultivator with spring field cultivator' },
							{ value: 'spring_plow', text: 'spring plow followed by field cultivator with fall field cultivator' },
							{ value: 'mulch_till_1', text: 'mulch tillage - disk before plant and chisel plow after harvest' },
							{ value: 'mulch_till_2', text: 'mulch tillage - chisel plow and disk before planting - no fall tillage' },
							{ value: 'no_till', text: 'no tillage - use zerotill in tillage.til to simulate a planter' }
						],
						fertilizer: [							
							{ value: 'fert_stess_test', text: 'fertilizer stress test' },
							{ value: 'fert_sprg_side', text: 'spring side dressing' }
						],
						irrigation: [
							{ value: 'waterStress', text: 'water stress' },
							{ value: 'irr_opt_sw_unlim', text: 'soil moisture deficit' }
						],
						grazing: [
							{ value: 'graze_winter', text: 'winter grazing' },
							{ value: 'graze_summer', text: 'summer grazing' }
						],
						hayForestCutting: [
							{ value: 'hay_cutting', text: 'hay cutting' },
							{ value: 'forest_cut', text: 'forest cutting' }
						]
					},
					irrWaterStressSources: [
						{ value: 'irr_str8_unlim', text: 'unlimited' },
						{ value: 'waterStressRes', text: 'reservoir' },
						{ value: 'waterStressAqu', text: 'aquifer' },
						{ value: 'irr_str8_cha', text: 'channel' }
					],
					irrWaterStressRes: [
						{ value: 'irr_str8_res', text: 'none' },
						{ value: 'irr_str8_r_a_u', text: 'aquifer backup (and unlimited backup to both)' },
						{ value: 'irr_str8_res_aqu', text: 'aquifer backup (no unlimited backup)' }
					],
					irrWaterStressAqu: [
						{ value: 'irr_str8_aqu', text: 'none' },
						{ value: 'irr_str8_a_r_u', text: 'reservoir backup (and unlimited backup to both)' },
						{ value: 'irr_str8_aqu_res', text: 'reservoir backup (no unlimited backup)' }
					],
					customDescriptions: {
						'fert_stess_test': 'fertilizer stress test',
						'fert_sprg_side': 'spring side dressing',
						'graze_winter': 'winter grazing',
						'graze_summer': 'summer grazing',
						'hay_cutting': 'hay cutting',
						'forest_cut': 'forest cutting',
						'irr_opt_sw_unlim': 'irrigate when there is a soil moisture deficit',
						'irr_str8_unlim': 'irrigate from an unlimited source when there is plant water stress',
						'irr_str8_res': 'irrigate from a reservoir when there is plant water stress',
						'irr_str8_aqu': 'irrigate from an aquifer when there is plant water stress',
						'irr_str8_cha': 'irrigate from a channel when there is plant water stress'
					}
				}
			},
			modal: {
				show: false,
				validate: false,
				saving: false,
				error: undefined,

				new: false,
				editIndex: 0,
				operation: {
					op_typ: 'plnt',
					mon: 0,
					day: 0,
					hu_sch: 0,
					op_data1: null,
					op_data2: null,
					op_data3: 0,
					order: 1
				}
			},
			reservedTableModal: {
				show: false,
				error: undefined
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
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put('mgt_sch/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post('mgt_sch/post/' + this.projectDbUrl, data);
		},
		getCodesDb() {
			return this.$http.get('codes/management_sch/op_typ/' + this.appPath);
		},
		getNamesAutoOps(name) {
			return this.getAutoComplete('lum.dtl', name);
		},
		getPlantsAutoOps(name) {
			return this.getAutoComplete('plant', name);
		},
		getNamesOpData1(name) {
			/*
			!! plnt; autoplnt - plant
			!! harv; autoharv - harvest only
			!! kill; autokill - kill
			!! hvkl; autohk - harvest and kill
			!! till; autotill - tillage
			!! irrm; autoirr - irrigation
			!! fert; autofert - fertlizer
			!! pest; pestauto - pesticide application
			!! graz; autograz - grazing
			!! burn; autoburn - burn
			!! swep; autoswep - street sweep
			!! prtp - print plant vars
			!! skip - skip to end of the year
			*/
			switch(this.modal.operation.op_typ) {
				case 'plnt':
				case 'harv':
				case 'kill':
				case 'hvkl':
					return this.getAutoComplete('plant', name);
				case 'till':
					return this.getAutoComplete('till', name);
				case 'irrm':
					return this.getAutoComplete('irr_ops', name);
				case 'fert':
					return this.getAutoComplete('fert', name);
				case 'pest':
					return this.getAutoComplete('pest', name);
				case 'graz':
					return this.getAutoComplete('graze_ops', name);
				case 'burn':
					return this.getAutoComplete('fire_ops', name);
				case 'swep':
					return this.getAutoComplete('sweep_ops', name);
				case 'prtp':
					break;
				case 'skip':
					break;
			}

			return null;
		},
		getNamesOpData2(name) {
			switch(this.modal.operation.op_typ) {
				case 'plnt':
				case 'kill':
					break;
				case 'harv':
				case 'hvkl':
					return this.getAutoComplete('harv_ops', name);
				case 'till':
				case 'irrm':
					break;
				case 'fert':
				case 'pest':
					return this.getAutoComplete('chem_app_ops', name);
				case 'graz':
				case 'burn':
				case 'swep':
				case 'prtp':
				case 'skip':
					break;
			}

			return null;
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

			for (let i = 1; i <= 31; i++) {
				this.data.days.push({ value: i, text: i.toString() });
			}

			if (this.item !== undefined) {
				this.log(this.item);
				this.form.name = this.item.name;

				for (let i = 0; i < this.item.auto_ops.length; i++) {
					this.form.auto_ops.push({
						name: this.item.auto_ops[i].d_table.name,
						description: this.item.auto_ops[i].d_table.description,
						plant1: this.item.auto_ops[i].plant1,
						plant2: this.item.auto_ops[i].plant2
					});
				}

				this.form.operations = this.item.operations;
				this.page.tabIndex = this.form.operations.length > 0 ? 1 : 0;
			}

			try {
				const response = await this.getCodesDb();
				this.data.op_codes = response.data;

				const response2 = await this.$http.get('decision_table_datasets_builder/' + this.datasetsDbUrl);
				this.log(response2.data);
				let builder_data = response2.data;
				this.data.builder.defaults = builder_data.tables;
				this.data.builder.warning = builder_data.warning;
				this.data.fertilizers = builder_data.fertilizers;
				this.data.chem_apps = builder_data.chem_apps;
				this.data.reservoirs = builder_data.reservoirs;
				this.data.aquifers = builder_data.aquifers;
				this.data.channels = builder_data.channels;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to load schedule data from database.');
			}

			this.log(this.form.operations);
			this.log(this.item);
			this.log(this.data);

			this.page.loading = false;
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.page.validated = true;
            var val_error = false;

			var item = this.form;			
			item.name = this.validName(this.form.name);
			
			try {
				const response = await this.putDb(item);
				this.page.validated = false;

				if (this.isUpdate)
					this.$bvToast.show('changes-saved');
				else
					this.$router.push({ name: 'Management'});
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to save changes to database.');
			}
			
			this.page.saving = false;
		},
		addAutoOp() {
			let resetAutoOp = {
				name: '',
				plant1: '',
				plant2: ''
			};
			let newName = this.data.new_auto_op.name;
			let matches = this.form.auto_ops.filter(function(el) { return el.name === newName; });
			let doesNotExist = matches === undefined || matches.length < 1;
			if (this.data.new_auto_op.name != '' && doesNotExist) {
				if ((newName === this.data.reserved_d_tables.summer1) ||
					(newName === this.data.reserved_d_tables.summer2) ||
					(newName === this.data.reserved_d_tables.winter1)) {
					this.reservedTableModal.show = true;
				} else {
					this.form.auto_ops.push(this.data.new_auto_op);
					this.data.new_auto_op = resetAutoOp;
				}
			}	
			
			if (!doesNotExist)
				this.data.new_auto_op = resetAutoOp;
		},
		removeAutoOp(element) {
			this.form.auto_ops.splice(this.form.auto_ops.indexOf(element), 1);
		},
		addReservedAutoOp() {
			if (this.isNullOrEmpty(this.data.new_auto_op.plant1) || 
				(this.data.new_auto_op.name === this.data.reserved_d_tables.summer2 && this.isNullOrEmpty(this.data.new_auto_op.plant2))) {
				this.reservedTableModal.error = 'Please enter a plant name.';
			} else {
				this.form.auto_ops.push(this.data.new_auto_op);
				this.cancelReservedAutoOp();
			}
		},
		cancelReservedAutoOp() {
			this.data.new_auto_op = {
				name: '',
				plant1: '',
				plant2: ''
			};
			this.reservedTableModal.show = false;
		},
		autoOpPlantLabel(op) {
			if (this.isNullOrEmpty(op.plant1)) return '';
			let str = `(${op.plant1}`;
			if (!this.isNullOrEmpty(op.plant2)) str += `, ${op.plant2}`;
			return str + ')';
		},
		removeOp(element) {
			this.form.operations.splice(this.form.operations.indexOf(element), 1);
		},
		editOp(op) {
			this.modal.operation = {
				op_typ: op.op_typ,
				mon: op.mon,
				day: op.day,
				hu_sch: op.hu_sch,
				op_data1: op.op_data1,
				op_data2: op.op_data2,
				op_data3: op.op_data3,
				order: op.order
			};
			this.modal.editIndex = this.form.operations.indexOf(op);
			this.modal.new = false;
			this.setLabels(op.op_typ);
			this.modal.show = true;
		},
		addOp(op) {
			this.modal.editIndex = 0;
			this.modal.new = true;
			this.setLabels('plnt');
			this.modal.show = true;
		},
		setLabels(name) {
			switch(name) {
				case 'plnt':
				case 'kill':
					this.data.op_data1.label = 'Plant name';
					this.data.op_data1.section = 'Databases / Plants';
					this.data.op_data1.file = 'plants.plt';
					this.data.op_data1.db = 'plants_plt';
					break;
				case 'harv':
				case 'hvkl':
					this.data.op_data1.label = 'Plant name';
					this.data.op_data1.section = 'Databases / Plants';
					this.data.op_data1.file = 'plants.plt';
					this.data.op_data1.db = 'plants_plt';
					this.data.op_data2.label = 'Harvest operation name';
					this.data.op_data2.section = 'Operations / Harvest';
					this.data.op_data2.file = 'harv.ops';
					this.data.op_data2.db = 'harv_ops';
					break;
				case 'till':
					this.data.op_data1.label = 'Tillage name';
					this.data.op_data1.section = 'Databases / Tillage';
					this.data.op_data1.file = 'tillage.til';
					this.data.op_data1.db = 'tillage_til';
					break;
				case 'irrm':
					this.data.op_data1.label = 'Irrigation operation name';
					this.data.op_data1.section = 'Operations / Irrigation';
					this.data.op_data1.file = 'irr.ops';
					this.data.op_data1.db = 'irr_ops';
					break;
				case 'fert':
					this.data.op_data1.label = 'Fertilizer name';
					this.data.op_data1.section = 'Databases / Fertilizer';
					this.data.op_data1.file = 'fertilizer.frt';
					this.data.op_data1.db = 'fertilizer_frt';
					this.data.op_data2.label = 'Chemical application name';
					this.data.op_data2.section = 'Operations / Chemical Application';
					this.data.op_data2.file = 'chem_app.ops';
					this.data.op_data2.db = 'chem_app_ops';
					break;
				case 'pest':
					this.data.op_data1.label = 'Pesticide name';
					this.data.op_data1.section = 'Databases / Pesticide';
					this.data.op_data1.file = 'pesticide.pes';
					this.data.op_data1.db = 'pesticide_pst';
					this.data.op_data2.label = 'Chemical application name';
					this.data.op_data2.section = 'Operations / Chemical Application';
					this.data.op_data2.file = 'chem_app.ops';
					this.data.op_data2.db = 'chem_app_ops';
					break;
				case 'graz':
					this.data.op_data1.label = 'Graze operation name';
					this.data.op_data1.section = 'Operations / Graze';
					this.data.op_data1.file = 'graze.ops';
					this.data.op_data1.db = 'graze_ops';
					break;
				case 'burn':
					this.data.op_data1.label = 'Fire operation name';
					this.data.op_data1.section = 'Operations / Fire';
					this.data.op_data1.file = 'fire.ops';
					this.data.op_data1.db = 'fire_ops';
					break;
				case 'swep':
					this.data.op_data1.label = 'Sweep operation name';
					this.data.op_data1.section = 'Operations / Sweep';
					this.data.op_data1.file = 'sweep.ops';
					this.data.op_data1.db = 'sweep_ops';
					break;
			}
		},
		changeOp(event) {
			this.setLabels(event);

			this.modal.operation.op_data1 = null;
			this.modal.operation.op_data2 = null;
		},
		goToProp() {},
		saveOp() {
			var ot = this.modal.operation.op_typ;
			if (ot == 'prtp' || ot == 'skip') {
				this.modal.operation.op_data1 = null;
				this.modal.operation.op_data2 = null;
				this.modal.operation.op_data3 = 0;
			}
			if (!(ot == 'harv' || ot == 'hvkl' || ot == 'fert' || ot == 'pest')){
				this.modal.operation.op_data2 = null;
			}

			if (this.modal.new) {
				this.form.operations.push(this.modal.operation);
			} else {
				this.form.operations[this.modal.editIndex] = this.modal.operation;
			}

			this.resetOp();
			this.sortOps();
			this.modal.show = false;
		},
		cancel() {
			this.modal.show = false;
			this.resetOp();
		},
		resetOp() {
			this.modal.operation = {
				op_typ: 'plnt',
				mon: 0,
				day: 0,
				hu_sch: 0,
				op_data1: null,
				op_data2: null,
				op_data3: 0,
				order: 1
			};
			this.setLabels('plnt');
		},
		sortOps() {
			function compare(a, b) {
				if (a.order < b.order)
					return -1;
				if (a.order > b.order)
					return 1;
				
				if (a.hu_sch == 0 && b.hu_sch > 0)
					return 1;
				if (a.hu_sch > 0 && b.hu_sch == 0)
					return -1;

				if (a.hu_sch < b.hu_sch)
					return -1;
				if (a.hu_sch > b.hu_sch)
					return 1;
				if (a.mon < b.mon)
					return -1;
				if (a.mon > b.mon)
					return 1;
				if (a.day < b.day)
					return -1;
				if (a.day > b.day)
					return 1;
				return 0;
			}

			return this.form.operations.sort(compare);
		},
		async goToAutoOp(name) {
			try {
				const response = await this.getAutoCompleteId('dtl', name);
				var id = response.data.id;
				
				this.$router.push({ name: 'DecisionsEdit', params: { id: id, dbtype: 'project' }});
			} catch (error) {
				this.page.error = this.logError(error, 'Cannot find ' + name + ' in database.');
			}
		},
		autoOpDescription(element) {
			if (element.name in this.data.builder.customDescriptions) return this.data.builder.customDescriptions[element.name];
			return this.isNullOrEmpty(element.description) ? element.name : element.description;
		},
		configureBuilderTable() {
			this.data.builder.modal.error = undefined;
			let data = this.data.builder.selections;
			let tableName = data.table;
			if (data.table === 'waterStress') {
				if (['waterStressRes','waterStressAqu'].includes(data.irrigation)) {
					tableName = data.irrigation2;
				} else {
					tableName = data.irrigation;
				}
			}

			if (tableName in this.data.builder.defaults) {
				let defaultTable = this.data.builder.defaults[tableName];
				this.data.builder.modal.op = {
					name: tableName,
					description: this.autoOpDescription(defaultTable),
					plant1: null,
					plant2: null,
					table: defaultTable,
					saveAsNew: false
				};
			} else {
				this.data.builder.modal.error = `Cannot find table ${tableName} in your swatplus_datasets.sqlite. Make sure you have version 2.1.0 or greater copied to your project folder.`;
			}

			this.data.builder.modal.show = true;
		},
		async getBuilderTable(element) {
			this.data.builder.modal.loading = true;
			this.data.builder.modal.show = true;
			this.data.builder.modal.error = undefined;

			try {
				const response = await this.$http.get(`decision_table_name/lum.dtl/${element.name}/${this.projectDbUrl}`);
				let table = response.data;
				this.data.builder.modal.op = {
					name: table.name,
					description: this.autoOpDescription(table),
					plant1: element.plant1,
					plant2: element.plant2,
					table: table,
					saveAsNew: false
				};
				this.data.builder.modal.editIndex = this.form.auto_ops.indexOf(element);
				//this.removeAutoOp(element);
			} catch (error) {
				this.data.builder.modal.error = this.logError(error, 'Cannot find ' + name + ' in database.');
			}

			this.data.builder.modal.loading = false;
		},
		async saveBuilderTable(overwrite) {
			this.log(this.data.builder.modal.op.table);
			this.data.builder.modal.saving = true;
			this.data.builder.modal.error = undefined;

			try {
				let op = this.data.builder.modal.op;
				let tableName = op.name;
				let autoOp = {
					name: tableName,
					description: op.description,
					plant1: null,
					plant2: null
				};

				if (this.reserved_d_table_array.includes(op.name)) {
					autoOp.plant1 = op.plant1;
					if (op.name === this.data.reserved_d_tables.summer2) {
						autoOp.plant2 = op.plant2;
					}
				}

				if (!this.reserved_d_table_array.includes(op.name) || op.saveAsNew) {
					if (this.reserved_d_table_array.includes(op.name)) {
						tableName = `${op.name}_${op.plant1}`;
						if (op.name === this.data.reserved_d_tables.summer2) {
							tableName += `_${op.plant2}`;
						}
					}

					let data = {
						overwrite: overwrite,
						name: tableName,
						description: op.description,
						file_name: 'lum.dtl',
						conditions: op.table.conditions,
						actions: op.table.actions
					};

					const dresp = await this.$http.post(`decision_table_builder/post/${this.projectDbUrl}`, data);
					this.log(dresp);
					tableName = dresp.data.name;
				} 

				autoOp.name = tableName;
				if (this.data.builder.modal.editIndex !== null) {
					this.form.auto_ops.splice(this.data.builder.modal.editIndex, 1);
					this.data.builder.modal.editIndex = null;
				}
				this.form.auto_ops.push(autoOp);

				this.data.builder.modal.show = false;
				this.resetBuilderOp();
			} catch (error) {
				this.data.builder.modal.error = this.logError(error, 'Error saving table.');
			}

			this.data.builder.modal.saving = false;
		},
		cancelBuilderTable() {
			this.data.builder.modal.show = false;
			this.resetBuilderOp();
		},
		resetBuilderOp() {
			this.data.builder.modal.op = {
				name: null,
				description: null,
				plant1: null,
				plant2: null,
				table: null,
				saveAsNew: false
			};
		},
		isBuilderTableIn(type) {
			let array = this.data.builder.tables[type];
			switch(type) {
				case 'irrWaterStressSources':
					array = this.data.builder.irrWaterStressSources;
					break;
				case 'irrWaterStressRes':
					array = this.data.builder.irrWaterStressRes;
					break;
				case 'irrWaterStressAqu':
					array = this.data.builder.irrWaterStressAqu;
					break;
				default:
					array = this.data.builder.tables[type];
					break;
			}
			let tableName = this.data.builder.modal.op.name;
			if (this.isNullOrEmpty(tableName)) return false;
			let matches = array.filter(function(el) { return tableName.startsWith(el.value); });
			return matches && matches.length > 0;
		},
		setActionObjNumFromCond(value, obj) {
			let matches = this.data.builder.modal.op.table.actions.filter(function(el) { return el.obj === obj; });
			for (let m of matches) {
				m.obj_num = value;
			}
		}
	},
	computed: {
		sortedOperations() {
			return this.sortOps();
		},
		opData3Label() {
			if (this.modal.operation.op_typ == 'fert' || this.modal.operation.op_typ == 'pest') return 'Amount applied (kg/ha)';
			if (this.modal.operation.op_typ == 'graz') return 'Number of days of grazing';
			if (this.modal.operation.op_typ == 'dwm') return 'Tile depth (mm)';
			return 'Operation data 3 (override)';
		},
		builderTableOptions() {
			switch(this.data.builder.selections.type) {
				case 'cropRotation':
					return this.data.builder.tables.cropRotation;
				case 'tillage':
					return this.data.builder.tables.tillage;
				case 'fertilizer':
					return this.data.builder.tables.fertilizer;
				case 'irrigation':
					return this.data.builder.tables.irrigation;
				case 'grazing':
					return this.data.builder.tables.grazing;
				case 'hayForestCutting':
					return this.data.builder.tables.hayForestCutting;
			}

			return [];
		},
		builderTableNullLabel() {
			switch(this.data.builder.selections.type) {
				case 'cropRotation':
					return 'a crop rotation';
				case 'tillage':
					return 'tillage';
				case 'fertilizer':
					return 'fertilizer';
				case 'irrigation':
					return 'a trigger';
				case 'grazing':
					return 'grazing season';
				case 'hayForestCutting':
					return 'type of cutting';
			}

			return '';
		},
		reserved_d_table_array() {
			return [this.data.reserved_d_tables.summer1, this.data.reserved_d_tables.summer2, this.data.reserved_d_tables.winter1];
		},
		validCropRotationConditions() {
			return this.data.builder.modal.op.table.conditions.filter(function(el) { return ['phu_base0', 'phu_plant'].includes(el.var); });
		},
		validIrrigationConditions() {
			return this.data.builder.modal.op.table.conditions.filter(function(el) { return ['soil_water', 'w_stress', 'vol', 'aqu_dep'].includes(el.var); });
		},
		validIrrigationActions() {
			return this.data.builder.modal.op.table.actions.filter(function(el) { return ['irr_demand', 'irrigate'].includes(el.act_typ); });
		},
		validFertilizerConditions() {
			return this.data.builder.modal.op.table.conditions.filter(function(el) { return !['plant_gro'].includes(el.var); });
		},
		validFertilizerActions() {
			if (!this.isNullOrEmpty(this.data.builder.modal.op.name)) {
				if (this.data.builder.modal.op.name.startsWith('fert_stess_test')) {
					return [
						{ heading: 'fertilize when nitrogen stress < amount above and plant is growing', action: this.data.builder.modal.op.table.actions[0] },
						{ heading: 'fertilize when phosphorus stress < amount above and plant is growing', action: this.data.builder.modal.op.table.actions[1] }
					];
				} else if (this.data.builder.modal.op.name.startsWith('fert_sprg_side')) {
					return [
						{ heading: 'fertilize just before planting in rotation year', action: this.data.builder.modal.op.table.actions[0] },
						{ heading: 'fertilize when plant is growing in rotation year, before it reaches maturity', action: this.data.builder.modal.op.table.actions[1] },
						{ heading: 'fertilize when plant is growing before it reaches maturity', action: this.data.builder.modal.op.table.actions[2] }
					];
				}
			}

			return [];
		}
	}
}
</script>