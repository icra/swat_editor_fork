<template>
	<div>
		<div v-if="page.loading">
			<div id="main-panel" class="no-sub">
				<section id="main"><page-loading :loading="page.loading"></page-loading></section>
			</div>
		</div>
		<div v-else-if="!isNullOrEmpty(page.error)">
			<div id="main-panel" class="no-sub">
				<section id="main">
					<div class="text-center lead">
						<h1>SWAT+ Editor {{version}}</h1>

						<b-alert variant="primary" show>
							<p>SWAT+ Editor encountered an error: {{page.error}}</p>
							<p>
								Check to make sure SWAT+ Editor is working properly by checking the Help page and scrolling to the bottom.
								Contact the developer if needed. First, you might try reloading in case your computer is slow to open the APIs:
							</p>
							<save-button @click.native="getInfo" type="button" :disabled="page.loading" text="Reload SWAT+ Editor" />
						</b-alert>
					</div>
				</section>
			</div>
		</div>
		<div v-else-if="!hasCurrentProject">
			<div id="main-panel" class="no-sub">
				<section id="main">
					<div class="text-center lead">
						<h1>Welcome to SWAT+ Editor {{version}}</h1>
						<p>
							<open-in-browser url="https://swatplus.gitbook.io/docs/release-notes"  text="Read our release notes" />
							to learn more about this release.
						</p>
					</div>

					<div v-if="recentProjects.length > 0" class="my-5 max-w-400 mx-auto">
						<h2 class="h6 text-center">Recent Projects</h2>
						<ul class="plain-border">
							<li v-for="(project, i) in recentProjects" :key="i" class="d-flex">
								<a href="#" :title="project.projectDb" :class="project.projectDb === currentProject.projectDb ? 'font-italic' : null"
									@click.prevent="loadProject(project)">{{project.name}}</a>
								<a class="ml-auto text-medium" href="#"
									@click.prevent="removeProject(project)"
									:title="'Remove ' + project.name + ' from recent projects list'">
									<font-awesome-icon :icon="['fas', 'times']" /></a>
							</li>
						</ul>
					</div>

					<div class="text-center border-dash my-4 max-w-400 mx-auto">
						<a href="#" @click.prevent="page.open.show = true" class="no-hover d-block p-4">
							<font-awesome-icon :icon="['fas', 'database']" size="3x" class="text-border" />
							<div class="lead text-muted">Open a project</div>
						</a>
					</div>

					<div class="text-center border-dash my-4 max-w-400 mx-auto">
						<a href="#" @click.prevent="page.create.show = true" class="no-hover d-block p-4">
							<font-awesome-icon :icon="['fas', 'plus']" size="3x" class="text-border" />
							<div class="lead text-muted">Create a new project</div>
						</a>
					</div>
				</section>
			</div>
		</div>
		<div v-else>
			<div id="side-sub-panel">
				<div class="p-3">
					<h1>SWAT+ Editor {{version}}</h1>
					<p>
						<open-in-browser url="https://swatplus.gitbook.io/docs/release-notes"  text="Read our release notes" />
						to learn more about this release.
					</p>

					<div>
						<b-button variant="primary" block @click="page.open.show = true">Open another project</b-button>
						<b-button variant="info" block @click="page.create.show = true">Create a new project</b-button>
					</div>

					<div v-if="recentProjects.length > 0" class="mt-4">
						<h2 class="h6">Recent Projects</h2>
						<ul class="plain-border">
							<li v-for="(project, i) in recentProjects" :key="i" class="d-flex">
								<a href="#" :title="project.projectDb" :class="project.projectDb === currentProject.projectDb ? 'font-italic' : null"
									@click.prevent="loadProject(project)">{{project.name}}</a>
								<a class="ml-auto text-medium" href="#"
									@click.prevent="removeProject(project)"
									:title="'Remove ' + project.name + ' from recent projects list'">
									<font-awesome-icon :icon="['fas', 'times']" /></a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div id="main-panel">
				<section id="main">
					<h1>Current project: {{currentProject.name}}</h1>
					<p v-if="!isNullOrEmpty(currentProject.description)">{{currentProject.description}}</p>
					<div class="mb-4">
						<open-file :file-path="info.file_path" css-class="btn btn-light d-block text-left border">
							<font-awesome-icon :icon="['fas', 'folder-open']" fixed-width class="mr-2 text-info" /> <code>{{info.file_path}}</code>
						</open-file>
					</div>
					<error-alert :text="versionSupport.error"></error-alert>
					<div v-if="versionSupport.supported">
						<b-row class="mb-4" v-if="info.status.imported_weather || info.status.wrote_inputs">
							<b-col md="6">
								<h5 class="mb-3">Status</h5>
								<ul class="list-table-sm">
									<li>
										<font-awesome-icon :icon="['fas', info.status.imported_weather ? 'check' : 'times']" :class="info.status.imported_weather ? 'text-success' : 'text-muted'" fixed-width />
										<router-link to="/edit/stations" class="ml-1">Set up weather stations and weather generators</router-link>
									</li>
									<li>
										<font-awesome-icon :icon="['fas', info.status.wrote_inputs ? 'check' : 'times']" :class="info.status.wrote_inputs ? 'text-success' : 'text-muted'" fixed-width />
										<router-link to="/run" class="ml-1">Wrote SWAT+ input files</router-link>
									</li>
									<li>
										<font-awesome-icon :icon="['fas', info.status.ran_swat ? 'check' : 'times']" :class="info.status.ran_swat ? 'text-success' : 'text-muted'" fixed-width />
										<router-link to="/run" class="ml-1">Ran SWAT+</router-link>
									</li>
									<li>
										<font-awesome-icon :icon="['fas', info.status.imported_output ? 'check' : 'times']" :class="info.status.imported_output ? 'text-success' : 'text-muted'" fixed-width />
										<router-link to="/run" class="ml-1">Imported SWAT+ output into a database for analysis</router-link>
									</li>
								</ul>

							</b-col>
							<b-col md v-if="info.scenarios.length > 0">
								<h5 class="mb-3">Saved scenarios</h5>
								<div class="mb-3" style="max-height:8rem; overflow:auto">
									<ul class="list-table-sm mb-0">
										<li v-for="(s, i) in info.scenarios" :key="i">
											<a href="#" @click.prevent="askLoadScenario(s)" :title="`Load scenario ${s.name}`">{{s.name}}</a>
										</li>
									</ul>
								</div>
							</b-col>
						</b-row>

						<h5 class="text-center mb-3">Project information</h5>
						<b-row class="mb-4">
							<b-col md>
								<table class="table table-sm border-bottom">
									<tbody>
										<tr>
											<th>Total area</th>
											<td>{{info.total_area | number(2)}} ha</td>
										</tr>
										<tr>
											<th>Simulation period</th>
											<td>
												{{info.simulation.yrc_start}}
												{{info.simulation.day_start > 0 ? 'day ' + info.simulation.day_start : ''}}
												-
												{{info.simulation.yrc_end}}
												{{info.simulation.day_end > 0 ? 'day ' + info.simulation.day_end : ''}}
											</td>
										</tr>
									</tbody>
								</table>
							</b-col>
							<b-col md>
								<table class="table table-sm border-bottom">
									<tbody>
										<tr>
											<th>Software</th>
											<td>SWAT+ Editor {{info.editor_version}}<span v-if="info.status.using_gis">, {{info.gis_version}}</span></td>
										</tr>
										<tr>
											<th>Last saved</th>
											<td>{{info.last_modified | date}}</td>
										</tr>
									</tbody>
								</table>
							</b-col>
						</b-row>

						<b-row>
							<b-col md>
								<h5 class="mt-2 mb-3">Object totals</h5>
								<table class="table table-sm border-bottom">
									<tr v-if="info.status.using_gis">
										<td class="text-right min">{{info.totals.subs}}</td>
										<td>Subbasins</td>
									</tr>
									<tr v-if="info.totals.lhru > 0">
										<td class="text-right min">{{info.totals.lhru}}</td>
										<td><router-link to="/edit/hrus-lte">HRUs</router-link></td>
									</tr>
									<tr v-else>
										<td class="text-right min">{{info.totals.hru}}</td>
										<td><router-link to="/edit/hrus">HRUs</router-link></td>
									</tr>
									<tr>
										<td class="text-right min">{{info.totals.cha > 0 ? info.totals.cha : info.totals.lcha}}</td>
										<td><router-link to="/edit/channels">Channels</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.aqu}}</td>
										<td><router-link to="/edit/aquifers">Aquifers</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.res}}</td>
										<td><router-link to="/edit/reservoirs">Reservoirs</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.rtu}}</td>
										<td><router-link to="/edit/routing_unit">Routing Units</router-link></td>
									</tr>
									<tr>
										<td class="text-right min">{{info.totals.lsus}}</td>
										<td><router-link to="/edit/regions/ls_units">Landscape Units</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.rec}}</td>
										<td><router-link to="/edit/recall">Recall (point source/inlet data)</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.exco}}</td>
										<td><router-link to="/edit/exco">Export Coefficients</router-link></td>
									</tr>
									<tr v-if="!info.is_lte">
										<td class="text-right min">{{info.totals.dlr}}</td>
										<td><router-link to="/edit/dr">Delivery Ratio</router-link></td>
									</tr>
								</table>
							</b-col>
							<b-col md v-if="info.status.using_gis">
								<div><highcharts :options="charts.landuse"></highcharts></div>
							</b-col>
						</b-row>
					</div>
					<div v-else-if="versionSupport.updatable">
						<p>
							You must update your project to continue using it in this version of SWAT+ Editor.
							If you do not wish to update your project, please uninstall this version of the editor and
							<open-in-browser url="https://swatplus.gitbook.io/docs/installation"  text="install a compatible earlier version" />.
						</p>
						<p>
							Your project database may be modified during the upgrade. We will make a backup of the database and store it in the Backups folder
							within your project directory. There may be changes to the model inputs, so we recommend you <open-in-browser url="https://swatplus.gitbook.io/docs/release-notes"  text="read our full release notes" />
							to see what has changed <strong>before</strong> upgrading your project.
						</p>
					</div>
				</section>
			</div>
			<action-bar>
				<b-button v-if="versionSupport.supported && info.status.imported_weather" type="button" variant="primary" to="/run">Run Model / Save Scenario</b-button>
				<b-button v-else-if="versionSupport.supported" type="button" variant="primary" to="/edit">Get started</b-button>
				<b-button v-else-if="versionSupport.updatable" type="button" variant="primary" @click="updateProject">Update project</b-button>
				<b-button v-if="versionSupport.supported" type="button" variant="secondary" class="ml-2" @click="openEditProject">Change Name/Description</b-button>
				<font-awesome-icon :icon="['fas', 'times']" size="lg" @click="page.close.removeFromRecent=false; page.close.show=true" class="ml-auto pointer text-muted" v-b-tooltip.hover.left="'Close this project'" />
			</action-bar>
		</div>

		<b-modal v-model="page.open.show" centered size="lg" title="Open a SWAT+ Editor Project">
			<error-alert :text="page.open.error"></error-alert>

			<b-form>
				<b-form-group label="Select your project/GIS SQLite database file">
					<select-file-input v-model="page.open.projectDb" :value="page.open.projectDb"
						fileType="sqlite" required
						invalidFeedback="Please select a SQLite database file." />
				</b-form-group>
			</b-form>

			<div slot="modal-footer">
				<save-button :saving="page.open.loading" text="Open" type="button" @click.native="openProject"></save-button>
				<b-button type="button" variant="secondary" @click="page.open.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.close.show" centered size="md" title="Close Current Project?">
			<p>
				This will close the project currently open, <strong>{{currentProject.name}}</strong>. Are you sure?
			</p>

			<div slot="modal-footer">
				<b-button type="button" variant="primary" @click="closeCurrentProject" class="mr-1">Yes</b-button>
				<b-button type="button" variant="secondary" @click="page.close.show = false">No</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.edit.show" centered size="lg" title="Update Project Name and Description">
			<error-alert :text="page.edit.error"></error-alert>

			<b-form>
				<b-form-group label="Project display name">
						<b-form-input v-model="page.edit.name" required></b-form-input>
					</b-form-group>

					<b-form-group label="Briefly describe your project location (main river, country)" description="25 character limit; spaces will be converted to underscores">
						<b-form-input v-model="page.edit.description" maxLength="25"></b-form-input>
					</b-form-group>
			</b-form>

			<div slot="modal-footer">
				<save-button :saving="page.edit.saving" text="Save" type="button" @click.native="editProject"></save-button>
				<b-button type="button" variant="secondary" @click="page.edit.show = false">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.import.show" centered size="lg" title="SWAT+ Editor Project from QSWAT+" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.open.error"></error-alert>
			<error-alert :text="page.import.error"></error-alert>
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error importing your GIS data." :stack-trace="task.error.toString()" />

			<div v-if="task.running">
				<b-progress :value="task.progress.percent" :max="100"></b-progress>
				<p>
					{{task.progress.message}}
				</p>
			</div>
			<div v-else-if="isNullOrEmpty(task.error)">
				<p>
					This is the first time opening your QSWAT+ project in SWAT+ Editor. We need to import your GIS data into SWAT+ objects.
					This may take a few seconds to several minutes depending on the size of your project.
				</p>

				<b-form>
					<b-form-group label="Project display name">
						<b-form-input v-model="page.import.project.name" required></b-form-input>
					</b-form-group>

					<b-form-group label="Briefly describe your project location (main river, country)" description="25 character limit; spaces will be converted to underscores">
						<b-form-input v-model="page.import.project.description" maxLength="25"></b-form-input>
					</b-form-group>

					<b-form-checkbox v-model="page.import.project.isLte" class="mt-4">
						Use SWAT+ lte? This is a lite version of the model that greatly simplifies hydrology and plant growth and
						does not simulate nutrients, concentrating on gully formation and stream degradation.
					</b-form-checkbox>
				</b-form>
			</div>

			<div slot="modal-footer">
				<save-button v-if="isNullOrEmpty(task.error)" :saving="task.running" text="Start" type="button" @click.native="importProject"></save-button>
				<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.loadScenario.show" size="lg" title="Load Scenario" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.loadScenario.error"></error-alert>
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error loading your scenario" :stack-trace="task.error.toString()" />

			<div v-if="task.running">
				<b-progress :value="task.progress.percent" :max="100"></b-progress>
				<p>
					{{task.progress.message}}
				</p>
			</div>
			<div v-else>
				<p>
					Are you sure you want to load the scenario, <strong>{{page.loadScenario.scenario.name}}</strong>?
					Loading the scenario will <strong class="text-danger">replace</strong> everything currently loaded
					in the editor (the default scenario), so please make sure any changes are saved as a new scenario if you wish
					to keep them. Scenarios can be saved from the <router-link to="/run">run model screen</router-link>.
				</p>
			</div>

			<div slot="modal-footer">
				<save-button :saving="task.running" type="button" @click.native="loadScenario" text="Load Scenario"></save-button>
				<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.create.show" centered size="lg" title="Create a New SWAT+ Editor Project">
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error creating your project." :stack-trace="task.error.toString()" />

			<div v-if="task.running">
				<b-progress :value="task.progress.percent" :max="100"></b-progress>
				<p>
					{{task.progress.message}}
				</p>
			</div>
			<div v-else-if="isNullOrEmpty(task.error)">
				<p>
					It is strongly recommended to start your new SWAT+ project from within the QSWAT+ interface.
					QSWAT+ will set up your watershed and direct you to the editor after HRU delineation. For help using QSWAT+,
					please <open-in-browser url="https://swat.tamu.edu/software/plus/"  text="visit our website" />.
				</p>
				<p>
					However, it is not required to use GIS to start your project. Complete the form below to start a SWAT+ Editor project from scratch.
					A project database will be created for you and you will need to input your spatial connections manually. If you already have
					a project database, click cancel below and choose the open project button instead.
				</p>

				<error-alert :text="page.create.error"></error-alert>

				<b-form>
					<b-form-group label="Project display name">
						<b-form-input v-model="page.create.name" required></b-form-input>
					</b-form-group>

					<b-form-group label="Briefly describe your project location (main river, country)" description="25 character limit; spaces will be converted to underscores">
						<b-form-input v-model="page.create.description" maxLength="25"></b-form-input>
					</b-form-group>

					<b-form-group label="Select your project folder" description="This will be where we create your project SQLite database file">
						<select-folder-input v-model="page.create.projectFolder" :value="page.create.projectFolder"
							required invalidFeedback="Please select a folder." />
					</b-form-group>

					<b-form-group label="Select your SWAT+ datasets SQLite database file">
						<select-file-input v-model="page.create.datasetsDb" :value="page.create.datasetsDb"
							fileType="sqlite" required
							invalidFeedback="Please select a SQLite database file." />
						<small class="form-text text-muted">
							If you do not have an existing dataset,
							<open-in-browser :url="datasets_online_url" text="download the newest version online" />.
							We recommend placing it in your project folder.
						</small>
					</b-form-group>

					<b-form-checkbox v-model="page.create.isLte" class="mt-4">
						Use SWAT+ lte? This is a lite version of the model that greatly simplifies hydrology and plant growth and
						does not simulate nutrients, concentrating on gully formation and stream degradation.
					</b-form-checkbox>
				</b-form>
			</div>

			<div slot="modal-footer">
				<save-button v-if="isNullOrEmpty(task.error)" :saving="page.create.loading || task.running" text="Create" type="button" @click.native="createProject"></save-button>
				<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.openConfirm.show" centered size="lg" title="Has your watershed changed?" no-close-on-backdrop no-close-on-esc hide-header-close>
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error re-importing your project GIS data." :stack-trace="task.error.toString()" />

			<div v-if="task.running">
				<b-progress :value="task.progress.percent" :max="100"></b-progress>
				<p>
					{{task.progress.message}}
				</p>
			</div>
			<div v-else-if="isNullOrEmpty(task.error)">
				<p>
					Did you run steps 1 or 2 of QSWAT+ since last opening SWAT+ Editor?
					If so, we'll need to re-import your watershed data.
				</p>
			</div>

			<div slot="modal-footer">
				<b-button type="button" variant="primary" @click="confirmOpen" class="mr-1">No, continue to editor</b-button>
				<save-button v-if="isNullOrEmpty(task.error)" :saving="task.running" text="Yes, import new watershed" type="button" @click.native="reImportProject"></save-button>
				<b-button v-if="task.running || !isNullOrEmpty(task.error)" type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.noProject.show" centered size="sm" title="Project Not Found">
			<p>
				The project's files cannot be found. Please use the open project button to select the project database file.
			</p>

			<div slot="modal-footer">
				<b-button type="button" variant="secondary" @click="page.noProject.show = false">OK</b-button>
			</div>
		</b-modal>

		<b-modal v-model="page.update.show" size="lg" title="Updating Project" no-close-on-backdrop no-close-on-esc hide-header-close>
			<error-alert :text="page.update.error"></error-alert>
			<stack-trace-error v-if="!isNullOrEmpty(task.error)" error-title="There was an error updating your project" :stack-trace="task.error.toString()" />

			<div v-if="task.running">
				<b-progress :value="task.progress.percent" :max="100"></b-progress>
				<p>
					{{task.progress.message}}
				</p>
			</div>

			<div slot="modal-footer">
				<b-button type="button" variant="secondary" @click="cancelTask">Cancel</b-button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import { runProcess } from '@/plugins/electron-process';
import SaveButton from '../components/SaveButton.vue';
const path = window.require('path');
const remote = window.require('electron').remote;

export default {
  components: { SaveButton },
	name: 'Setup',
	mixins: [runProcess],
	data() {
		return {
			datasets_online_url: 'https://bitbucket.org/swatplus/swatplus.editor/downloads/swatplus_datasets.sqlite',
			page: {
				loading: false,
				error: null,
				open: {
					loading: false,
					error: null,
					show: false,
					projectDb: null
				},
				edit: {
					saving: false,
					error: null,
					show: false,
					name: null,
					description: null
				},
				create: {
					loading: false,
					error: null,
					show: false,
					name: null,
					description: null,
					projectFolder: null,
					datasetsDb: null,
					isLte: false
				},
				close: {
					show: false,
					removeFromRecent: false
				},
				import: {
					show: false,
					error: null,
					project: {
						projectDb: null,
						datasetsDb: null,
						name: null,
						description: null,
						version: null,
						isLte: false
					}
				},
				openConfirm: {
					show: false,
					error: null,
					project: {}
				},
				loadScenario: {
					show: false,
					error: null,
					running: false,
					scenario: {}
				},
				noProject: {
					show: false
				},
				update: {
					show: false,
					error: null,
					running: false
				}
			},
			versionSupport: {},
			recentProjects: [],
			info: {},
			charts: {
				landuse: {}
			},
			task: {
				progress: {
					percent: 0,
					message: null
				},
				process: null,
				error: null,
				running: false
			},
			loadTries: 0
		}
	},
	async created() {
		await this.init();
	},
	methods: {
		async init() {
			this.recentProjects = this.getRecentProjects();

			let cmdDb = remote.getGlobal('cmd_settings').project_db;
			if (!this.isNullOrEmpty(cmdDb)) {
				this.page.loading = true;
				this.page.open.projectDb = cmdDb;
				await this.openProject();
				this.page.loading = false;
			} else {
				let hasProject = this.hasCurrentProject && this.pathExists(this.currentProject.projectDb);
				if (!hasProject) {
					let project = this.getMostRecentProject();
					if (project !== undefined && this.pathExists(project.projectDb)) {
						this.$store.commit('setCurrentProject', project);
						hasProject = true;
					}
				}

				this.setWindowTitle();

				if (hasProject) {
					await this.getInfo();
					//this.versionSupport = this.getVersionSupport(this.currentProject.version);
				}
			}
		},
		async sleep(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		async getInfo() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get(`setup/info/${this.projectDbUrl}`);
				console.log(response)
				this.log(response.data);
				this.info = response.data;
				this.charts.landuse = this.getPieChart('Land use distribution', this.info.charts.landuse);
				this.versionSupport = this.getVersionSupport(this.currentProject.version);
			} catch (error) {
				if (error.response && error.response.status === 400 && error.response.data.message == 'Project has not been set up.') {
					this.page.open.projectDb = this.currentProject.projectDb;
					await this.openProject();
				} else if (this.loadTries < 10) {
					this.loadTries++;
					await this.sleep(2000);
					await this.getInfo();
				} else {
					this.page.error = this.logError(error, 'Unable to get project information from database.');
				}
			}

            this.page.loading = false;
		},
		openEditProject() {
			this.page.edit.name = this.currentProject.name;
			this.page.edit.description = this.currentProject.description;
			this.page.edit.show = true;
		},
		async editProject() {
			this.page.edit.saving = true;
			this.page.edit.error = null;

            try {
				let data = {
					'name': this.validName(this.page.edit.name),
					'description': this.validName(this.page.edit.description)
				};

				const response = await this.$http.put(`setup/config/${this.projectDbUrl}`, data);
				this.log(response.data);
				this.currentProject.name = data.name;
				this.currentProject.description = data.description;
				this.page.edit.show = false;
				await this.loadProject(this.currentProject);
			} catch (error) {
				this.page.edit.error = this.logError(error, 'Unable to save changes.');
			}

            this.page.edit.saving = false;
		},
		async openProject() {
			this.page.open.loading = true;
			this.page.open.error = null;

            try {
				const response = await this.$http.get(`setup/check-config/${this.page.open.projectDb}`);
				this.log(response.data);

				let data = response.data;
				let project = {
					projectDb: this.page.open.projectDb,
					datasetsDb: data.reference_db,
					name: data.project_name,
					description: data.project_description,
					version: data.editor_version,
					isLte: data.is_lte
				};

				if (this.isNullOrEmpty(data.gis_version)) {
					await this.loadProject(project);
				} else if (data.imported_gis) {
					this.page.openConfirm.project = project;
					this.page.openConfirm.show = true;
				} else {
					project.version = this.version;
					this.page.import.project = project;
					this.page.import.show = true;
				}

				this.page.open.show = false;
			} catch (error) {
				if (this.loadTries < 10) {
					this.loadTries++;
					await this.sleep(2000);
					await this.openProject();
				} else {
					this.page.open.error = this.logError(error, 'Unable to get project information from database.');
				}
			}

            this.page.open.loading = false;
		},
		createProject() {
			this.page.create.loading = true;
			this.page.create.error = null;

			if (this.isNullOrEmpty(this.page.create.name))
				this.page.create.error = 'Please enter a name for your project.';
			else if (this.isNullOrEmpty(this.page.create.projectFolder))
				this.page.create.error = 'Please select a project folder.';
			else if (this.isNullOrEmpty(this.page.create.datasetsDb))
				this.page.create.error = 'Please select a datasets SQLite file.';
			else {
				let fileName = this.validFileName(this.page.create.name).toLowerCase();
				let project = {
					projectDb: path.join(this.page.create.projectFolder, fileName + '.sqlite'),
					datasetsDb: this.page.create.datasetsDb,
					name: this.validName(this.page.create.name),
					description: this.validName(this.page.create.description),
					version: this.version,
					isLte: this.page.create.isLte
				};
				let lte = project.isLte ? 'y' : 'n';

				let args = [
					'setup_project',
					'--project_db_file='+ project.projectDb,
					'--datasets_db_file='+ project.datasetsDb,
					'--project_name='+ project.name,
					'--editor_version='+ this.version,
					'--is_lte=' + lte,
					'--project_description='+ project.description
				];

				this.runTask(args, project);
			}

			this.page.create.loading = false;
		},
		async loadProject(project) {
			if (this.pathExists(project.projectDb)) {
				this.$store.commit('setCurrentProject', project);
				this.pushRecentProject(project);
				this.recentProjects = this.getRecentProjects();
				this.setWindowTitle();
				this.versionSupport = this.getVersionSupport(project.version);
				await this.getInfo();
				remote.getGlobal('cmd_settings').project_db = undefined;
			} else {
				this.page.noProject.show = true;
			}
		},
		removeProject(project) {
			if (this.currentProject.projectDb === project.projectDb) {
				this.page.close.removeFromRecent = true;
				this.page.close.show = true;
			} else {
				this.deleteRecentProject(project);
				this.recentProjects = this.getRecentProjects();
			}
		},
		closeCurrentProject() {
			if (this.page.close.removeFromRecent) {
				this.deleteRecentProject(this.currentProject);
				this.recentProjects = this.getRecentProjects();
			}

			this.$store.commit('setCurrentProject', {
				projectDb: null,
				datasetsDb: null,
				name: null,
				version: null,
				isLte: false
			});
			this.versionSupport = {};
			this.page.close.show = false;
		},
		askLoadScenario(scenario) {
			this.log(scenario);
			this.page.loadScenario.scenario = scenario;
			this.page.loadScenario.show = true;
		},
		loadScenario() {
			this.page.loadScenario.error = null;
			this.page.loadScenario.running = true;

			let args = [
				'load_scenario',
				'--project_db_file='+ this.currentProject.projectDb,
				'--project_name='+ this.page.loadScenario.scenario.name
			];

			this.runTask(args, this.currentProject);
		},
		importProject() {
			this.page.import.error = null;

			if (this.isNullOrEmpty(this.page.import.project.name)) {
				this.page.import.error = 'Please give your project a name in the text box below.';
			} else {
				let project = this.page.import.project;
				let lte = project.isLte ? 'y' : 'n';

				let args = [
					'setup_project',
					'--project_db_file='+ project.projectDb,
					'--project_name='+ this.validName(project.name),
					'--editor_version='+ this.version,
					'--is_lte=' + lte,
					'--project_description='+ this.validName(project.description)
				];

				this.runTask(args, project);
			}
		},
		reImportProject() {
			let project = this.page.openConfirm.project;
			let lte = project.isLte ? 'y' : 'n';
			this.page.update.running = true;

			let args = [
				'reimport_gis',
				'--project_db_file='+ project.projectDb,
				'--project_name='+ project.name,
				'--editor_version='+ this.version,
				'--is_lte=' + lte
			];

			this.runTask(args, project);
		},
		updateProject() {
			this.page.update.error = null;
			this.page.update.show = true;
			this.page.update.running = true;

			let args = [
				'update_project',
				'--project_db_file='+ this.currentProject.projectDb,
				'--editor_version='+ this.version,
				'--update_project_values=n',
				'--reimport_gis=n'
			];

			this.runTask(args, this.currentProject);
		},
		async confirmOpen() {
			this.page.openConfirm.show = false;
			await this.loadProject(this.page.openConfirm.project);
		},
		runTask(args, project) {
			this.task.error = null;
			this.task.running = true;
			this.task.progress = {
				percent: 0,
				message: null
			};

			this.task.process = this.getApiProc('swatplus_api', args);

			this.task.process.stdout.on('data', (data) => {
				this.task.progress = this.getApiOutput(data);
			});

			this.task.process.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				this.task.error = data;
				this.task.running = false;
			});

			this.task.process.on('close', (code) => {
				if (this.isNullOrEmpty(this.task.error)) {
					if (this.page.loadScenario.running) {
						this.page.open.projectDb = project.projectDb;
						this.openProject().finally(() => {
							this.task.running = false;
							this.closeTaskModals();
						});
					} else {
						if (this.page.update.running) {
							project.version = this.version;
						}
						this.loadProject(project).finally(() => {
							this.task.running = false;
							this.closeTaskModals();
						});
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
			this.page.import.show = false;
			this.page.loadScenario.show = false;
			this.page.loadScenario.running = false;
			this.page.create.show = false;
			this.page.openConfirm.show = false;
			this.page.update.show = false;
		}
	}
}
</script>
