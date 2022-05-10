<template>
	<project-container :loading="page.loading" add-error-frame>
		<div id="side-sub-panel">
			<ul class="vertical menu">
				<li>
					<span @click="show.cli = !show.cli">
						Climate
						<i><font-awesome-icon :icon="show.cli ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.cli" id="showCli">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/wgn">Weather Generator</router-link></li>
							<li><router-link to="/edit/stations">Weather Stations</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.con = !show.con">
						Connections
						<i><font-awesome-icon :icon="show.con ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.con" id="showCon">
						<ul class="menu vertical nested">
							<li>
								<i @click="show.channels = !show.channels">
									<font-awesome-icon :icon="show.channels ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
								<router-link to="/edit/channels">
									Channels
								</router-link>

								<b-collapse v-model="show.channels" id="showChannels">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/channels/initial">Initial</router-link></li>
										<li><router-link to="/edit/channels/hydsed">Hydrology &amp; Sediment</router-link></li>
										<li><router-link to="/edit/channels/nutrients">Nutrients</router-link></li>
									</ul>
								</b-collapse>
							</li>

							<!-- HRUs -->
							<li v-if="!currentProject.isLte"><router-link to="/edit/hrus">HRUs</router-link></li>
							<li v-else><router-link to="/edit/hrus-lte">HRUs</router-link></li>
							<!-- HRUs -->

							<!-- Routing Units -->
							<li v-if="!currentProject.isLte">
								<i @click="show.routUnits = !show.routUnits">
									<font-awesome-icon :icon="show.routUnits ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/routing_unit">
									Routing Units
								</router-link>

								<b-collapse v-model="show.routUnits" id="showRoutingUnit">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/routing_unit/elements">Elements</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<!-- Routing Units -->

							<!-- Aquifers -->
							<li v-if="!currentProject.isLte">
								<i @click="show.aquifers = !show.aquifers">
									<font-awesome-icon :icon="show.aquifers ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/aquifers">
									Aquifers
								</router-link>

								<b-collapse v-model="show.aquifers" id="showAquifers">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/aquifers/initial">Initial</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<!-- Aquifers -->

							<!-- Reservoirs -->
							<li v-if="!currentProject.isLte">
								<i @click="show.reservoirs = !show.reservoirs">
									<font-awesome-icon :icon="show.reservoirs ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/reservoirs">
									Reservoirs
								</router-link>

								<b-collapse v-model="show.reservoirs" id="showReservoirs">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/reservoirs/hydrology">Reservoir Hydrology</router-link></li>
										<li><router-link to="/edit/reservoirs/initial">Initial</router-link></li>
										<li><router-link to="/edit/reservoirs/sediment">Sediment</router-link></li>
										<li><router-link to="/edit/reservoirs/nutrients">Nutrients</router-link></li>
										<li><router-link to="/edit/reservoirs/wetlands">Wetlands</router-link></li>
										<li><router-link to="/edit/reservoirs/wetlands_hydrology">Wetland Hydrology</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<!-- Reservoirs -->

							<!-- Recall -->
							<li v-if="!currentProject.isLte">
								<router-link to="/edit/recall" title="Recall / Export Coefficients">Point Source / Inlet</router-link>
							</li>
							<!-- Recall -->

							<!-- Exco -->
							<li v-if="false && !currentProject.isLte">
								<i @click="show.exco = !show.exco">
									<font-awesome-icon :icon="show.exco ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/exco">
									Export Coefficients
								</router-link>

								<b-collapse v-model="show.exco" id="showExco">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/exco/om">Organic Mineral</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<!-- Exco -->

							<!-- Delratio -->
							<li v-if="!currentProject.isLte">
								<i @click="show.dr = !show.dr">
									<font-awesome-icon :icon="show.dr ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/dr">
									Delivery Ratio
								</router-link>

								<b-collapse v-model="show.dr" id="showDr">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/dr/om">Organic Mineral</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<!-- Delratio -->
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.basin = !show.basin">
						Basin
						<i><font-awesome-icon :icon="show.basin ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.basin" id="showBasin">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/basin/codes">Codes</router-link></li>
							<li><router-link to="/edit/basin/parameters">Parameters</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.regions = !show.regions">
						Regions
						<i><font-awesome-icon :icon="show.regions ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.regions" id="showRegions">
						<ul class="menu vertical nested">
							<li>
								<i @click="show.lsUnits = !show.lsUnits">
									<font-awesome-icon :icon="show.ls_units ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
								<router-link to="/edit/regions/ls_units">Landscape Units</router-link>

								<b-collapse v-model="show.lsUnits" id="showLsUnits">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/regions/ls_units/elements">Elements</router-link></li>
									</ul>
								</b-collapse>
							</li>
						</ul>
					</b-collapse>
				</li>
				<li v-if="!currentProject.isLte">
					<span @click="show.lum = !show.lum">
						Land Use Management
						<i><font-awesome-icon :icon="show.lum ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.lum" id="showLum">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/lum/landuse">Land Use Management</router-link></li>
							<li><router-link to="/edit/lum/mgt">Management Schedules</router-link></li>
							<li>
								<i @click="show.ops = !show.ops">
									<font-awesome-icon :icon="show.ops ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/lum/ops">Operations Databases</router-link>

								<b-collapse v-model="show.ops" id="showOps">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/lum/ops/harvest">Harvest</router-link></li>
										<li><router-link to="/edit/lum/ops/graze">Graze</router-link></li>
										<li><router-link to="/edit/lum/ops/irrigation">Irrigation</router-link></li>
										<li><router-link to="/edit/lum/ops/chemapp">Chemical Applications</router-link></li>
										<li><router-link to="/edit/lum/ops/fire">Fire</router-link></li>
										<li><router-link to="/edit/lum/ops/sweep">Sweep</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<li><router-link to="/edit/lum/cntable">Curve Numbers</router-link></li>
							<li><router-link to="/edit/lum/conspractice">Conservation Practices</router-link></li>
							<li><router-link to="/edit/lum/ovntable">Manning's n</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.decisionTable = !show.decisionTable">
						Decision Tables
						<i><font-awesome-icon :icon="show.decisionTable ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.decisionTable" id="showDecisionTables">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/decision_table/lum">Land Use Management</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/decision_table/res_rel">Reservoir Release</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/decision_table/scen_lu">Scenario Land Use</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/decision_table/flo_con">Flow Conditions</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li v-if="!currentProject.isLte">
					<span @click="show.change = !show.change">
						Change
						<i><font-awesome-icon :icon="show.change ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.change" id="showChange">
						<ul class="menu vertical nested">
							<li>
								<i @click="show.hardCal = !show.hardCal">
									<font-awesome-icon :icon="show.hardCal ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/change/hard">Hard Calibration</router-link>

								<b-collapse v-model="show.hardCal" id="showHardCal">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/change/hard/parms">Parameters</router-link></li>
									</ul>
								</b-collapse>
							</li>
							<li>
								<i @click="show.softCal = !show.softCal">
									<font-awesome-icon :icon="show.softCal ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/change/soft">Soft Calibration</router-link>

								<b-collapse v-model="show.softCal" id="showSoftCal">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/change/soft/wb">Water Balance</router-link></li>
										<li><router-link to="/edit/change/soft/wbparms">Water Balance Parameters</router-link></li>
										<li><router-link to="/edit/change/soft/chsed">Channel Sediment Budget</router-link></li>
										<li><router-link to="/edit/change/soft/chsedparms">Channel Parameters</router-link></li>
										<li><router-link to="/edit/change/soft/plant">Plant Growth</router-link></li>
										<li><router-link to="/edit/change/soft/plantparms">Plant Parameters</router-link></li>
									</ul>
								</b-collapse>
							</li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.init = !show.init">
						Initialization Data
						<i><font-awesome-icon :icon="show.init ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.init" id="showInit">
						<ul class="menu vertical nested">
							<li v-if="!currentProject.isLte"><router-link to="/edit/init/plant">Plant Communities</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/init/soil_plant">Soil Plant</router-link></li>
							<li><router-link to="/edit/init/om_water">Organic Mineral</router-link></li>
							<li v-if="!currentProject.isLte">
								<i @click="show.constituents = !show.constituents">
									<font-awesome-icon :icon="show.constituents ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>

								<router-link to="/edit/init/constituents">Constituents</router-link>

								<b-collapse v-model="show.constituents" id="showConstituents">
									<ul class="menu vertical nested">
										<li><router-link to="/edit/init/constituents/pest-hru">Pesticides (HRU)</router-link></li>
										<li><router-link to="/edit/init/constituents/pest-water">Pesticides (Water)</router-link></li>
										<li><router-link to="/edit/init/constituents/path-hru">Pathogens (HRU)</router-link></li>
										<li><router-link to="/edit/init/constituents/path-water">Pathogens (Water)</router-link></li>
									</ul>
								</b-collapse>
							</li>
						</ul>
					</b-collapse>
				</li>
				<li v-if="!currentProject.isLte">
					<span @click="show.hyd = !show.hyd">
						Hydrology
						<i><font-awesome-icon :icon="show.hyd ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.hyd" id="showHyd">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/hydrology">Hydrology</router-link></li>
							<li><router-link to="/edit/topography">Topography</router-link></li>
							<li><router-link to="/edit/fields">Fields</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.soils = !show.soils">
						Soils
						<i><font-awesome-icon :icon="show.soils ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.soils" id="showSoils">
						<ul class="menu vertical nested">
							<li v-if="!currentProject.isLte"><router-link to="/edit/soils">Soils</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/soil-nutrients">Nutrients</router-link></li>
							<li v-if="currentProject.isLte"><router-link to="/edit/soils-lte">Soil Textures</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li>
					<span @click="show.db = !show.db">
						Databases
						<i><font-awesome-icon :icon="show.db ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.db" id="showDb">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/db/plants">Plants</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/fertilizer">Fertilizer</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/tillage">Tillage</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/pesticides">Pesticides</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/pathogens">Pathogens</router-link></li>
							<!--						ICRA Adrià Riu &#45;&#45; Pollutants db view-->
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/pollutants">Pollutants</router-link></li>

							<li><router-link to="/edit/db/urban">Urban</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/septic">Septic</router-link></li>
							<li v-if="!currentProject.isLte"><router-link to="/edit/db/snow">Snow</router-link></li>
						</ul>
					</b-collapse>
				</li>
				<li v-if="!currentProject.isLte">
					<span @click="show.structural = !show.structural">
						Structural
						<i><font-awesome-icon :icon="show.structural ? ['fas', arrow.close] : ['fas', arrow.open]" fixed-width /></i>
					</span>
					<b-collapse v-model="show.structural" id="showStructural">
						<ul class="menu vertical nested">
							<li><router-link to="/edit/structural/tiledrain">Tile Drains</router-link></li>
							<li><router-link to="/edit/structural/septic">Septic Systems</router-link></li>
							<li><router-link to="/edit/structural/filterstrip">Filter Strips</router-link></li>
							<li><router-link to="/edit/structural/grassedww">Grassed Waterways</router-link></li>
							<li><router-link to="/edit/structural/bmpuser">User BMPs</router-link></li>
						</ul>
					</b-collapse>
				</li>
			</ul>
		</div>
		<div id="main-panel">
			<section id="main">
				<div v-if="$route.path == '/edit'">
					<h1>Edit SWAT+ inputs</h1>

					<p>
						Use the menu on the left to edit SWAT+ input data. We recommend starting in the climate section, and importing your weather generators and observed weather data.
						If you're coming from GIS, when you import weather generators or observed data, it will create weather stations and match them to your spatial objects automatically.
					</p>

					<h2 class="mt-4">Help</h2>
					<p>
						In the upper right corner of each editor section linked from the left menu is a book icon <font-awesome-icon :icon="['fas', 'book']" /> you may click
						to see our documentation website for that section. Documentation is still a work in progress.

						In addition, click the <router-link to="/help"><font-awesome-icon :icon="['fas', 'question-circle']" /></router-link> in the lower left corner of this window for
						links to resources to help you with SWAT+ and the editor. User groups are available where you can ask questions if you get stuck.
					</p>

					<p class="border-top pt-3 mt-4">
						Any SWAT+ features not available through the editor can be modified manually through the text input files.
						Edit your data as needed through the editor, then proceed to the <router-link to="/runall">Run SWAT+</router-link> section.
						After your initial files are written, you can modify them or add additional SWAT+ input files to your model.
						Make a copy of any changes before returning to SWAT+ Editor, as the editor may overwrite them.
					</p>

					<action-bar>
						<router-link to="/edit/wgn" class="btn btn-primary">Add weather generators now</router-link>
					</action-bar>
				</div>
				<router-view></router-view>
			</section>
		</div>
	</project-container>
</template>

<script>
export default {
	name: 'Edit',
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			show: {
				cli: true,
				basin: false,
				con: true,
				hyd: false,
				db: false,
				init: false,
				lum: false,
				decisionTable: false,
				soils: false,
				regions: false,
				change: false,
				structural: false,
				channels: this.$route.name.includes('Channels'),
				aquifers: this.$route.name.includes('Aquifers'),
				reservoirs: this.$route.name.includes('Reservoirs'),
				hrus: this.$route.name.includes('Hrus'),
				hrusLte: this.$route.name.includes('HrusLte'),
				routUnits: this.$route.name.includes('RoutingUnit'),
				exco: this.$route.name.includes('Exco'),
				dr: this.$route.name.includes('Delratio'),
				recall: this.$route.name.includes('Recall'),
				ops: this.$route.name.includes('Operations'),
				lsUnits: this.$route.name.includes('LandscapeUnits'),
				hardCal: this.$route.name.includes('HardCalibration'),
				softCal: this.$route.name.includes('SoftCalibration'),
				constituents: this.$route.name.includes('Constituents')
			},
			arrow: {
				open: 'angle-left',
				close: 'angle-down'
			}
		}
	},
	watch: {
		'$route' (to, from) {
			this.show.channels = to.name.includes('Channels');
			this.show.aquifers = to.name.includes('Aquifers');
			this.show.reservoirs = to.name.includes('Reservoirs');
			this.show.hrus = to.name.includes('Hrus');
			this.show.hrusLte = to.name.includes('HrusLte');
			this.show.routUnits = to.name.includes('RoutingUnit');
			this.show.exco = to.name.includes('Exco');
			this.show.dr = to.name.includes('Delratio');
			this.show.recall = to.name.includes('Recall');
			this.show.ops = to.name.includes('Operations');
			this.show.lsUnits = to.name.includes('LandscapeUnits');
			this.show.hardCal = to.name.includes('HardCalibration');
			this.show.softCal = to.name.includes('SoftCalibration');
			this.show.constituents = to.name.includes('Constituents');
		}
	}
}
</script>
