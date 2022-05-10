<template>
	<project-container :loading="page.loading" add-error-frame>
		<div id="main-panel" class="no-sub">
			<section id="main">
				<div v-if="!hasImportedWeather">
					<h1>Not ready to run the model</h1>

					<b-alert variant="info" show>
						You must add weather generators and stations before writing inputs and running the model.
					</b-alert>
					<router-link to="/edit/wgn" class="btn btn-primary">Add Now</router-link>
				</div>
				<b-form v-else @submit.prevent="runSelected" :validated="page.validated">
					<error-alert :text="page.saveError"></error-alert>
					<error-alert :text="false && page.validated && !page.submitted ? 'Please expand the sections below, complete all required fields, and try again.' : null"></error-alert>

					<h1>Confirm Simulation Settings</h1>

					<div class="accordion-custom" role="tablist">
						<b-card no-body>
							<template #header>
								<div class="d-flex align-items-center">
									<b v-b-toggle.accordion-1 class="ac-head">Choose where to write your input files</b>
									<div class="ml-auto ac-preview">{{config.input_files_dir}}</div>
								</div>
							</template>
							<b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
								<b-card-body>
									<select-folder-input required
										v-model="config.input_files_dir" :value="config.input_files_dir"
										invalidFeedback="Required" />
								</b-card-body>
							</b-collapse>
						</b-card>
						<b-card no-body>
							<template #header>
								<div class="d-flex align-items-center">
									<b v-b-toggle.accordion-2 class="ac-head">Set your simulation period</b>
									<div class="ml-auto ac-preview">{{time.yrc_start}} - {{time.yrc_end}}</div>
								</div>
							</template>
							<b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
								<b-card-body>
									<p v-if="hasObservedWeather">
										Make sure your simulation dates fall within the dates in your
										<router-link to="/edit/stations">observed weather files</router-link>. Simulation dates outside this range will result in simulated weather.
									</p>

									<b-form-group label="Starting date of simulation">
										<b-form-datepicker v-model="timeDisplay.startDate"
											:date-format-options="{ day: 'numeric', month: 'long', year: 'numeric' }"
											show-decade-nav></b-form-datepicker>
									</b-form-group>

									<b-form-group label="Ending date of simulation">
										<b-form-datepicker v-model="timeDisplay.endDate"
											:date-format-options="{ day: 'numeric', month: 'long', year: 'numeric' }"
											show-decade-nav></b-form-datepicker>
									</b-form-group>

									<b-button v-b-toggle.accordion-2a variant="light" type="button" class="border font-italic mb-2">Advanced user options...</b-button>

									<b-collapse id="accordion-2a" accordion="my-accordion2a" role="tabpanel">
										<b-card bg-variant="light">
											<b-form-group label="Time steps in a day for rainfall, runoff and routing">
												<b-form-select v-model="time.step" :options="options.timeSteps" />
											</b-form-group>
										</b-card>
									</b-collapse>
								</b-card-body>
							</b-collapse>
						</b-card>
						<b-card no-body>
							<template #header>
								<div class="d-flex align-items-center">
									<b v-b-toggle.accordion-3 class="ac-head">Choose output to print</b>
									<div class="ml-auto ac-preview"></div>
								</div>
							</template>
							<b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
								<b-card-body>
									<b-row>
										<b-col lg="6">
											<b-form-group label="Warm-up period" description="Number of years to skip printing output">
												<b-form-input type="number" min="0" required v-model.number="print.prt.nyskip" style="max-width:300px" />
											</b-form-group>

											<b-table-simple small table-class="edit border-bottom" style="width:auto">
												<b-thead>
													<b-tr class="bg-light">
														<b-th></b-th>
														<b-th class="text-center">Daily</b-th>
														<b-th class="text-center">Monthly</b-th>
														<b-th class="text-center">Yearly</b-th>
														<b-th class="text-center">Average</b-th>
														<b-th title="SWAT+ Output File/Table">Outputs</b-th>
													</b-tr>
													<b-tr>
														<b-th></b-th>
														<b-th class="text-center"><b-form-checkbox @change="checkAllDaily" /></b-th>
														<b-th class="text-center"><b-form-checkbox @change="checkAllMonthly" /></b-th>
														<b-th class="text-center"><b-form-checkbox @change="checkAllYearly" /></b-th>
														<b-th class="text-center"><b-form-checkbox @change="checkAllAvann" /></b-th>
														<b-th></b-th>
													</b-tr>
												</b-thead>
												<b-tbody>
													<b-tr class="bg-light">
														<b-th colspan="6">Model Components</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.model" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">
															{{k}}
															<div v-if="k === 'channel_sd'">channel_sdmorph</div>
														</b-td>
													</b-tr>
													<b-tr class="bg-light">
														<b-th colspan="6">Basin Model Components</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.modelBasin" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">
															{{k}}
															<div v-if="k === 'basin_sd_cha'">basin_sd_chamorph</div>
														</b-td>
													</b-tr>
													<b-tr class="bg-light" v-show="printConfig.showInactive">
														<b-th colspan="6">Region Model Components</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.modelRegion" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">{{k}}</b-td>
													</b-tr>
													<b-tr class="bg-light">
														<b-th colspan="6">Nutrient Balance</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.nutrients" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">{{k}}</b-td>
													</b-tr>
													<b-tr class="bg-light">
														<b-th colspan="6">Water Balance</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.water" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">{{k}}</b-td>
													</b-tr>
													<b-tr class="bg-light">
														<b-th colspan="6">Plant Weather</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.plant" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">{{k}}</b-td>
													</b-tr>
													<b-tr class="bg-light">
														<b-th colspan="6">Losses</b-th>
													</b-tr>
													<b-tr v-for="(v, k) in printGroups.losses" :key="k" v-show="!printConfig.inactive.includes(k) || printConfig.showInactive">
														<b-td>{{v}}</b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].daily" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].monthly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].yearly" /></b-td>
														<b-td class="text-center"><b-form-checkbox v-model="print.objects[printIndex(k)].avann" /></b-td>
														<b-td class="code text-muted">{{k}}</b-td>
													</b-tr>
												</b-tbody>
											</b-table-simple>

											<p class="mb-0"><b-form-checkbox v-model="printConfig.showInactive">Show all print objects?<br />Leave unchecked to hide print objects that are not relevant for this project.</b-form-checkbox></p>
										</b-col>
										<b-col lg="6">
											<b-button v-b-toggle.accordion-3a variant="light" type="button" class="border font-italic mb-2">Advanced user options...</b-button>

											<b-collapse id="accordion-3a" accordion="my-accordion3a" role="tabpanel">
												<b-card bg-variant="light">
													<div class="d-flex">
														<div class="pr-3">
															<b-form-checkbox v-model="print.prt.soilout">Soil nutrients carbon output file</b-form-checkbox>
															<b-form-checkbox v-model="print.prt.hydcon">Hydrograph connect output file</b-form-checkbox>
															<b-form-checkbox v-model="print.prt.csvout">Print output files in CSV format</b-form-checkbox>
														</div>
														<div>
															<b-form-checkbox v-model="print.prt.mgtout">Management output file</b-form-checkbox>
															<b-form-checkbox v-model="print.prt.fdcout">Flow duration curve output file</b-form-checkbox>
														</div>
													</div>

													<hr class="my-3" />

													<b-form-group label="Date to start printing output" description="Leave blank to print entire simulation period">
														<b-form-datepicker v-model="printDisplay.startDate"
															:date-format-options="{ day: 'numeric', month: 'long', year: 'numeric' }"
															show-decade-nav></b-form-datepicker>
													</b-form-group>

													<b-form-group label="Date to stop printing output" description="Leave blank to print entire simulation period">
														<b-form-datepicker v-model="printDisplay.endDate"
															:date-format-options="{ day: 'numeric', month: 'long', year: 'numeric' }"
															show-decade-nav></b-form-datepicker>
													</b-form-group>

													<b-form-group label="Daily print within the period (e.g., interval=2 will print every other day)">
														<b-form-input type="number" min="0" required v-model.number="print.prt.interval" />
													</b-form-group>
												</b-card>
											</b-collapse>
										</b-col>
									</b-row>
								</b-card-body>
							</b-collapse>
						</b-card>
					</div>

					<hr class="my-4" />

					<h1>Run SWAT+</h1>

					<p>
						Before running the model, we must write the input files used by the model.
						If you have modified your inputs via the edit section since last running the model, be sure to keep this box checked.
						Check the third box to read your output files into a SQLite database.
						This will be used by the visualization tool in QSWAT+. If you do not intend to use this feature,
						you may uncheck this box to save time.
					</p>

					<b-list-group class="normal-cursor">
						<b-list-group-item class="bg-light">
							<div class="d-flex align-items-start">
								<b-form-checkbox v-model="selection.inputs" id="select_inputs"></b-form-checkbox>
								<div>
									<label for="select_inputs"><b>Write input files</b></label>
									<span class="text-muted" v-if="!isNullOrEmpty(config.input_files_last_written)">
										<br>Last written {{ config.input_files_last_written | date }}
									</span>
								</div>
							</div>
						</b-list-group-item>
						<b-list-group-item class="bg-light">
							<div class="d-flex align-items-start">
								<b-form-checkbox v-model="selection.model" id="select_model"></b-form-checkbox>
								<div>
									<label for="select_model"><b>Run SWAT+ rev. {{ swatplus }}</b></label>
									<span class="text-muted" v-if="!isNullOrEmpty(config.swat_last_run)">
										<br>Last run {{ config.swat_last_run | date }}
									</span>
									<div class="mt-1" v-if="selection.model && platform === 'win32'">
										<b-form-checkbox v-model="selection.debug">Use debug version?</b-form-checkbox>
									</div>
								</div>
							</div>
						</b-list-group-item>
						<b-list-group-item class="bg-light">
							<div class="d-flex align-items-start">
								<b-form-checkbox v-model="selection.output" id="select_output"></b-form-checkbox>
								<div>
									<label for="select_output"><b>Analyze output for visualization</b></label>
									<span class="text-muted" v-if="!isNullOrEmpty(config.output_last_imported)">
										<br>Last analyzed {{ config.output_last_imported | date }}
									</span>
								</div>
							</div>
						</b-list-group-item>
					</b-list-group>

					<action-bar full-width>
						<save-button :disabled="page.saving || noneSelected" text="Save Settings &amp; Run Selected" @click.native="page.validated = true" />
						<b-button v-if="!isNullOrEmpty(config.output_last_imported) && !currentProject.isLte" type="button" variant="primary" to="/check" class="mr-1">Run SWAT+ Check</b-button>
						<b-button type="button" variant="primary" class="mr-1" @click="page.saveScenario.show = true">Save Scenario</b-button>
						<b-button type="button" variant="secondary" @click="exit" class="ml-auto">Exit SWAT+ Editor</b-button>
					</action-bar>
				</b-form>

				<b-modal v-model="page.run.show" size="lg" :title="modalTitle" no-close-on-backdrop no-close-on-esc hide-header-close>
					<error-alert :text="page.run.error"></error-alert>
					<stack-trace-error v-if="!isNullOrEmpty(task.error) && !status.model" :error-title="errorTitle" :stack-trace="task.error.toString()" />

					<b-alert variant="danger" :show="!isNullOrEmpty(task.error) && status.model">
						{{task.error}}
						<span v-if="!selection.debug && platform === 'win32'">Please run the model in debug mode to get a detailed error report.</span>
						<span v-else>
							If you cannot determine the cause of the error, please copy and paste the output log below to the
							<open-in-browser url="https://groups.google.com/d/forum/swatplus" text="SWAT+ model user group" />.
						</span>
					</b-alert>

					<div v-if="task.running">
						<b-progress :value="totalProgress" :max="100"></b-progress>
						<p>
							{{task.progress.message}}
						</p>
					</div>
					<div v-if="status.model && !isNullOrEmpty(task.error)" ref="messageDisplay" class="scroll-bottom mt-2">
						<pre><div v-for="(message, i) in task.modelMessages" :key="i">{{message}}</div></pre>
					</div>

					<div slot="modal-footer">
						<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
					</div>
				</b-modal>

				<b-modal v-model="page.completed.show" size="md" title="All selected tasks have completed." hide-footer>
					<div>
						<b-button v-if="!isNullOrEmpty(config.output_last_imported) && !currentProject.isLte" type="button" variant="primary" to="/check" block>Run SWAT+ Check</b-button>
						<b-button type="button" variant="primary" @click="page.completed.show = false; page.saveScenario.show = true" block>Save Scenario</b-button>
						<open-file :file-path="currentResultsPath" css-class="btn btn-block btn-primary">Open Results Directory</open-file>
						<b-row class="mt-2" no-gutters>
							<b-col md><b-button type="button" variant="secondary" @click="page.completed.show = false" block class="mr-1">Back to Editor</b-button></b-col>
							<b-col md><b-button type="button" variant="secondary" @click="exit" block class="ml-1">Exit SWAT+ Editor</b-button></b-col>
						</b-row>
					</div>
				</b-modal>

				<b-modal v-model="page.saveScenario.show" size="lg" title="Save Scenario" no-close-on-backdrop no-close-on-esc hide-header-close>
					<error-alert :text="page.saveScenario.error"></error-alert>
					<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error saving your scenario" :stack-trace="task.error.toString()" />

					<div v-if="task.running">
						<b-progress :value="task.progress.percent" :max="100"></b-progress>
						<p>
							{{task.progress.message}}
						</p>
					</div>
					<div v-else>
						<p>
							Saving a scenario will make a copy your project database as well as all model input and output text files.
							We recommend running the model before saving your scenario. After saving completes, any additional changes
							made to your project will not affect the saved scenario.
							You may load the saved scenario back to the editor from the
							<router-link to="/setup">project setup screen</router-link>.
						</p>

						<b-form-group label="Give your scenario a unique name" description="Will create a new folder with this name under your project's Scenarios directory. Cannot be the same name as an existing scenario.">
							<b-form-input type="text" required v-model.number="page.saveScenario.name" />
						</b-form-group>
					</div>

					<div slot="modal-footer">
						<save-button :saving="task.running" type="button" @click.native="saveScenario" text="Save Scenario"></save-button>
						<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
					</div>
				</b-modal>

				<b-modal v-model="page.savedScenario.show" size="md" title="Scenario Saved">
					<p>
						<b>Your scenario has been saved.</b>
						Any additional changes made to your project will not affect the saved scenario.
						You may load the saved scenario back to the editor from the <router-link to="/setup">project setup screen</router-link>.
					</p>

					<div slot="modal-footer">
						<open-file :file-path="newScenarioPath" css-class="btn btn-primary mr-1">Open Scenario Directory</open-file>
						<b-button type="button" variant="secondary" @click="page.savedScenario.show = false">Close</b-button>
					</div>
				</b-modal>
			</section>
		</div>
	</project-container>
</template>

<style scoped>
.scroll-bottom {
	width: 100%;
	height: 350px;
	border: 1px solid #ccc;
	overflow:auto;
}
</style>

<script>
import { runProcess } from '@/plugins/electron-process';
import moment from 'moment';
const path = window.require('path');

export default {
	name: 'Run',
	mixins: [runProcess],
	data() {
		return {
			page: {
				loading: false,
				error: null,
				validated: false,
				submitted: false,
				saving: false,
				saveError: null,
				run: {
					show: false
				},
				completed: {
					show: false
				},
				saveScenario: {
					show: false,
					name: null,
					error: null
				},
				savedScenario: {
					show: false
				}
			},
			hasImportedWeather: false,
			hasObservedWeather: false,
            config: {
                swat_last_run: null,
                input_files_dir: null,
                input_files_last_written: null
			},
			timeDisplay: {
				startDate: null,
				endDate: null
			},
			time: {
				day_start: 0,
				yrc_start: 1980,
				day_end: 0,
				yrc_end: 1985,
				step: 0
			},
			printDisplay: {
				startDate: null,
				endDate: null
			},
			print: {
				prt: {
					nyskip: 1,
					day_start: 0,
					yrc_start: 0,
					day_end: 0,
					yrc_end: 0,
					interval: 1,
					soilout: false,
					mgtout: false,
					hydcon: false,
					fdcout: false,
					csvout: false
				},
				objects: []
			},
			options: {
				timeSteps: [
					{ value: 0, text: 'Daily' },
					{ value: 1, text: 'Increment' },
					{ value: 24, text: 'Hourly' },
					{ value: 96, text: '15 Minutes' },
					{ value: 1440, text: '1 Minute' }
				],
				printAll: {
					daily: false,
					monthly: false,
					yearly: false,
					avann: false
				}
			},
			task: {
				progress: {
					percent: 0,
					message: null
				},
				process: null,
				error: null,
				running: false,
				modelMessages: [],
				modelYear: -1
			},
			status: {
				inputs: false,
				model: false,
				output: false,
				saveScenario: false
			},
			selection: {
				inputs: true,
				model: true,
				output: true,
				debug: false
			},
			printGroups: {
				model: {
					'channel': 'Channel',
					'channel_sd': 'Channel',
                    'aquifer': 'Aquifer',
					'reservoir': 'Reservoir',
					'recall': 'Point Source (Recall)',
					'ru': 'Routing Unit',
					'hyd': 'Hydrology'
				},
				modelBasin: {
					'basin_cha': 'Channel',
                    'basin_sd_cha': 'Channel',
                    'basin_aqu': 'Aquifer',
                    'basin_res': 'Reservoir',
                    'basin_psc': 'Point Source (Recall)'
				},
				modelRegion: {
					'region_cha': 'Channel',
					'region_sd_cha': 'Channel',
					'region_aqu': 'Aquifer',
					'region_res': 'Reservoir',
					'region_psc': 'Point Source (Recall)'
				},
				nutrients: {
					'basin_nb': 'Basin',
					'lsunit_nb': 'Landscape Unit',
					'hru_nb': 'HRU',
					'hru-lte_nb': 'HRU-LTE',
					'region_nb': 'Region',
				},
				water: {
					'basin_wb': 'Basin',
					'lsunit_wb': 'Landscape Unit',
					'hru_wb': 'HRU',
					'hru-lte_wb': 'HRU-LTE',
					'region_wb': 'Region',
				},
				plant: {
					'basin_pw': 'Basin',
					'lsunit_pw': 'Landscape Unit',
					'hru_pw': 'HRU',
					'hru-lte_pw': 'HRU-LTE',
					'region_pw': 'Region',
				},
				losses: {
					'basin_ls': 'Basin',
					'lsunit_ls': 'Landscape Unit',
					'hru_ls': 'HRU',
					'hru-lte_ls': 'HRU-LTE',
					'region_ls': 'Region',
				}
			},
			printConfig: {
                inactive: [
                    'region_wb',
                    'region_nb',
                    'region_ls',
                    'region_pw',
                    'region_aqu',
                    'region_res',
                    'region_cha',
                    'region_sd_cha',
                    'region_psc',
					'basin_cha',
					'channel'
                ],
                hru: ['hru_wb', 'hru_nb', 'hru_ls', 'hru_pw'],
                hru_lte: ['hru-lte_wb', 'hru-lte_nb', 'hru-lte_ls', 'hru-lte_pw'],
				showInactive: false,
				changedObjects: []
            }
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	watch: {
		'$route': 'get'
	},
	computed: {
		noneSelected() {
			return !(this.selection.inputs || this.selection.model || this.selection.output);
		},
		totalProgress() {
			if (!this.task.running) return 0;

			let numTasks = 3;
			let eachTaskPer = 100 / numTasks;
			let thisTaskPer = eachTaskPer * this.task.progress.percent / 100;
			if (this.status.inputs) return thisTaskPer;
			if (this.status.model) return eachTaskPer + thisTaskPer;
			if (this.status.output) return eachTaskPer * 2 + thisTaskPer;

			return 0;
		},
		modalTitle() {
			if (this.status.inputs) return 'Writing SWAT+ Input Files';
			else if (this.status.model) return `Running SWAT+ rev. ${this.swatplus}`;
			else if (this.status.output) return 'Reading SWAT+ Output Files';
			return 'Running SWAT+';
		},
		errorTitle() {
			if (this.status.inputs) return 'There was an error writing your input files.';
			else if (this.status.output) return 'There was an error processing your output files.';
			return 'SWAT+ Editor has encountered an error.';
		},
		currentResultsPath() {
			return this.resultsPath(this.config.input_files_dir);
		},
		newScenarioPath() {
			if (this.isNullOrEmpty(this.page.saveScenario.name)) return '';
			return path.join(this.projectPath, 'Scenarios', this.validFileName(this.page.saveScenario.name));
		}
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`setup/run-info/${this.projectDbUrl}`);
				this.log(response.data);
                this.config = response.data.config;
                this.time = response.data.time;
				this.print = response.data.print;
				this.hasImportedWeather = response.data.imported_weather;
				this.hasObservedWeather = response.data.has_observed_weather;

				this.timeDisplay.startDate = this.getDateStringFromTime(this.time.day_start, this.time.yrc_start);
				this.timeDisplay.endDate = this.getDateStringFromTime(this.time.day_end, this.time.yrc_end, true);
				this.printDisplay.startDate = this.getDateStringFromTime(this.print.prt.day_start, this.print.prt.yrc_start);
				this.printDisplay.endDate = this.getDateStringFromTime(this.print.prt.day_end, this.print.prt.yrc_end, true);

				if (this.currentProject.isLte) {
					this.printConfig.inactive = this.printConfig.inactive.concat(this.printConfig.hru);
				} else {
					this.printConfig.inactive = this.printConfig.inactive.concat(this.printConfig.hru_lte);
				}

				if (this.isNullOrEmpty(this.config.input_files_dir)) {
					this.config.input_files_dir = this.txtInOut;
				}
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}

            this.page.loading = false;
		},
		getDateStringFromTime(day, year, isEnd=false) {
			if (year === 0) return null;
			if (isEnd && day === 0) return `${year}-12-31`;
			let d = moment(`${year}-01-01`);
			if (day !== 0) d.add(day-1, 'days');
			return d.format('YYYY-MM-DD');
		},
		getDayYearFromDateString(value, isEnd=false) {
			if (this.isNullOrEmpty(value)) {
				return {
					day: 0,
					year: 0
				};
			}

			let d = moment(String(value));
			let day = d.dayOfYear();

			if (!isEnd && day === 1) day = 0;
			else if (isEnd && d.month() === 11 && d.date() === 31) day = 0;

			/*this.log(d);
			this.log(d.month());
			this.log(d.date());*/

			return {
				day: day,
				year: d.year()
			};
		},
		async runSelected() {
			this.page.saving = true;
			this.page.saveError = null;
			this.page.submitted = true;

			if (this.noneSelected) {
				this.page.saveError = 'Please select at least one task to run';
			} else {
				try {
					let startTimeUpdate = this.getDayYearFromDateString(this.timeDisplay.startDate);
					let endTimeUpdate = this.getDayYearFromDateString(this.timeDisplay.endDate, true);
					this.time.day_start = startTimeUpdate.day;
					this.time.yrc_start = startTimeUpdate.year;
					this.time.day_end = endTimeUpdate.day;
					this.time.yrc_end = endTimeUpdate.year;

					let startPrintUpdate = this.getDayYearFromDateString(this.printDisplay.startDate);
					let endPrintUpdate = this.getDayYearFromDateString(this.printDisplay.endDate, true);
					this.print.prt.day_start = startPrintUpdate.day;
					this.print.prt.yrc_start = startPrintUpdate.year;
					this.print.prt.day_end = endPrintUpdate.day;
					this.print.prt.yrc_end = endPrintUpdate.year;

					let data = {
						input_files_dir: this.config.input_files_dir.replace(/\\/g,"/"),
						time: this.time,
						print: this.print.prt,
						print_objects: this.print.objects
					};
					await this.$http.put(`setup/run-info/${this.projectDbUrl}`, data);
					this.page.validated = false;

					if (this.selection.inputs) {
						this.page.run.show = true;
						this.runInputs();
					} else if (this.selection.model) {
						if (this.isNullOrEmpty(this.config.input_files_last_written))
							this.page.saveError = 'You must write input files before running the model.';
						else  {
							this.page.run.show = true;
							this.runModel();
						}
					} else if (this.selection.output) {
						if (this.isNullOrEmpty(this.config.swat_last_run))
							this.page.saveError = 'You must run SWAT+ before analyzing output.';
						else {
							this.page.run.show = true;
							this.runOutput();
						}
					}
				} catch (error) {
					this.page.saveError = this.logError(error, 'Unable to update input files directory.');
				}
			}

            this.page.saving = false;
			this.page.submitted = false;
		},
		scrollMessage() {
			let messageDisplay = this.$refs.messageDisplay;
			messageDisplay.scrollTop = messageDisplay.scrollHeight;
		},
		runInputs() {
			this.status.inputs = true;
			this.status.model = false;
			this.status.output = false;
			this.status.saveScenario = false;

			let process = this.getApiProc('swatplus_api', [
				'write_files',
				'--project_db_file='+ this.currentProject.projectDb,
				'--swat_version='+ this.swatplus
			]);

			this.runTask(process);
		},
		runModel() {
			this.status.inputs = false;
			this.status.model = true;
			this.status.output = false;
			this.status.saveScenario = false;

			this.runTask(this.getSwatProc(this.config.input_files_dir, this.selection.debug));
		},
		runOutput() {
			this.status.inputs = false;
			this.status.model = false;
			this.status.output = true;
			this.status.saveScenario = false;

			let process = this.getApiProc('swatplus_api', [
				'read_output',
                '--output_files_dir='+ this.config.input_files_dir.replace(/\\/g,"/"),
				'--output_db_file='+ this.outputDbPath(this.config.input_files_dir),
				'--swat_version='+ this.swatplus,
				'--editor_version='+ this.version,
				'--project_name='+ this.currentProject.name
			]);

			this.runTask(process);
		},
		saveScenario() {
			this.page.saveScenario.error = null;

			if (this.isNullOrEmpty(this.page.saveScenario.name)) {
				this.page.saveScenario.error = 'Please enter a name for the scenario.';
			} else {
				this.status.inputs = false;
				this.status.model = false;
				this.status.output = false;
				this.status.saveScenario = true;

				let process = this.getApiProc('swatplus_api', [
					'save_scenario',
					'--project_db_file='+ this.currentProject.projectDb,
					'--input_files_dir='+ this.config.input_files_dir,
					'--output_files_dir='+ this.currentResultsPath,
					'--project_name='+ this.validFileName(this.page.saveScenario.name)
				]);

				this.runTask(process);
			}
		},
		runTask(process) {
			this.task.error = null;
			this.task.running = true;
			this.task.progress = {
				percent: 0,
				message: null
			};
			this.task.modelMessages = [];
			this.task.modelYear = -1;

			this.task.process = process;

			this.task.process.stdout.on('data', (data) => {
				if (this.status.model) {
					let str = data.toString().trim();
					if (!str.startsWith('Original Simulation')) {
						//this.task.modelMessages.push(str);
						this.task.progress = { percent: 5, message: 'Running SWAT+' };
					} else {
						let arr = str.split(' ').filter(function(el) { return el !== '' });
						let yrIdx = arr.indexOf('Yr');
						if (yrIdx > -1) {
							let thisYr = arr[yrIdx + 1];
							if (thisYr !== this.task.modelYear) {
								let totalYears = this.time.yrc_end - this.time.yrc_start + 1;
								let yrProg = this.time.yrc_start + Number(thisYr) - 1;
								this.task.modelYear = thisYr;
								//this.task.modelMessages.push(`Running model year ${thisYr}`);
								this.task.progress = { percent: thisYr / totalYears * 100, message: `Executing model year ${yrProg} (${thisYr} of ${totalYears})` };
							}
						}
					}
					//this.scrollMessage();
				}
				else this.task.progress = this.getApiOutput(data);
			});

			this.task.process.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				if (this.status.model) {
					this.task.error = 'There was an error running SWAT+';
					if (this.task.modelMessages.length > 500) this.task.modelMessages = [];
					this.task.modelMessages.push(data);
					this.scrollMessage();
					this.get();
				}
				else this.task.error = data;
				this.task.running = false;
			});

			this.task.process.on('close', (code) => {
				this.log('ok');
				if (this.isNullOrEmpty(this.task.error)) {
					this.log('ok2');
					if (this.status.inputs && this.selection.model) {
						this.runModel();
					} else if (this.status.model) {
						this.$http.put(`setup/swatrun/${this.projectDbUrl}`).finally(() => {
							if (this.selection.output) {
								this.runOutput();
							} else {
								this.task.running = false;
								this.closeTaskModals();
								this.completeTask();
							}
						});
					} else if (this.status.output) {
						this.$http.put(`setup/outputread/${this.projectDbUrl}`).finally(() => {
							this.task.running = false;
							this.closeTaskModals();
						this.completeTask();
						});
					} else if (this.status.saveScenario) {
						this.log('here');
						this.task.running = false;
						this.closeTaskModals();
						this.page.savedScenario.show = true;
						this.status.saveScenario = false;
					} else {
						this.task.running = false;
						this.closeTaskModals();
						this.completeTask();
					}
				}
			});
		},
		cancelTask() {
			this.task.error = null;
			if (this.task.process !== null)
				this.task.process.kill();

			this.task.running = false;
			this.closeTaskModals();
		},
		closeTaskModals() {
			this.page.run.show = false;
			this.page.saveScenario.show = false;
		},
		async completeTask() {
			this.page.completed.show = true;
			await this.get();
		},
        checkAllDaily() {
            this.options.printAll.daily = !this.options.printAll.daily;
            for (var i = 0; i < this.print.objects.length; i++) {
                this.print.objects[i].daily = this.options.printAll.daily;
                this.pushChg(i);
            }
        },
        checkAllMonthly() {
            this.options.printAll.monthly = !this.options.printAll.monthly;
            for (var i = 0; i < this.print.objects.length; i++) {
                this.print.objects[i].monthly = this.options.printAll.monthly;
                this.pushChg(i);
            }
        },
        checkAllYearly() {
            this.options.printAll.yearly = !this.options.printAll.yearly;
            for (var i = 0; i < this.print.objects.length; i++) {
                this.print.objects[i].yearly = this.options.printAll.yearly;
                this.pushChg(i);
            }
        },
        checkAllAvann() {
            this.options.printAll.avann = !this.options.printAll.avann;
            for (var i = 0; i < this.print.objects.length; i++) {
                this.print.objects[i].avann = this.options.printAll.avann;
                this.pushChg(i);
            }
        },
        pushChg(i) {
            if (this.printConfig.changedObjects.indexOf(i) == -1) {
				this.printConfig.changedObjects.push(i);
			}
		},
		printIndex(name) {
			return this.print.objects.findIndex(x => x.name === name);
		}
	}
}
</script>
