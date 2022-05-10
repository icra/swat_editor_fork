<template>
	<project-container :loading="page.loading" add-error-frame>
		<div v-if="currentProject.isLte">			
			<div id="main-panel" class="no-sub">
				<section id="main">
					<h1>SWAT+ Check Not Available</h1>

					<b-alert variant="info" show>
						SWAT+ Check is not available for SWAT+ lte models.
					</b-alert>

					<b-button type="button" variant="secondary" @click="exit" class="ml-auto">Exit SWAT+ Editor</b-button>
				</section>
			</div>
		</div>
		<div v-else-if="!isNullOrEmpty(page.error)">			
			<div id="main-panel" class="no-sub">
				<section id="main">
					<stack-trace-error error-title="There was an error loading SWAT+ Check for your project." :stack-trace="page.error" />
				</section>
			</div>
		</div>
		<div v-else-if="isNullOrEmpty(config.output_last_imported)">
			<div id="main-panel" class="no-sub">
				<section id="main">
					<h1>Not ready to run SWAT+ Check</h1>

					<b-alert variant="info" show>
						You must run the model and analyze output before running SWAT+ Check.
					</b-alert>
					<router-link to="/run" class="btn btn-primary">Configure Model Run</router-link>
				</section>
			</div>
		</div>
		<div v-else>
			<div id="side-sub-panel">
				<div class="p-3">
					<ul class="plain-border no-top-bottom">
						<li v-for="(t, i) in page.tabs" :key="i">
							<a href="#" @click.prevent="page.tabIndex = i" :class="page.tabIndex == i ? 'active' : ''">{{t}}</a>
						</li>
					</ul>
				</div>
			</div>
			<div id="main-panel">
				<section id="main">
					<h1>SWAT+ Check {{page.tabIndex > 0 ? '/ ' + page.tabs[page.tabIndex] : ''}}</h1>

					<div v-if="page.tabIndex == 0" title="Information">
						<p>
							SWAT+ Check reads model output from a SWAT+ project and performs many simple checks to identify 
							potential model problems. The intended purpose of this program is to identify model problems early in the 
							modeling process. Hidden model problems often result in the need to recalibrate or regenerate a model, 
							resulting in an avoidable waste of time. This program is designed to compare a variety of SWAT+ outputs to 
							nominal ranges based on the judgment of model developers. A warning does not necessarily indicate a problem; 
							the purpose is to bring attention to unusual predictions. This software also provides a visual representation 
							of various model outputs to aid novice users.
						</p>

						<b-row>
							<b-col md>
								<table class="table table-striped table-sm border-bottom">
									<tr>
										<th>Model Version</th>
										<td>SWAT+ rev. {{data.setup.swatVersion}}</td>
									</tr>
									<tr>
										<th>Simulation Length</th>
										<td>{{data.setup.simulationLength}} years</td>
									</tr>
									<tr>
										<th>Warm-up</th>
										<td>{{data.setup.warmUp}} years</td>
									</tr>
									<tr>
										<th>Weather</th>
										<td>{{data.setup.weatherMethod}}</td>
									</tr>
								</table>
							</b-col>
							<b-col md>
								<table class="table table-striped table-sm border-bottom">
									<tr>
										<th>Watershed Area</th>
										<td>{{data.setup.watershedArea | number(2)}} ha</td>
									</tr>
									<tr>
										<th>HRUs</th>
										<td>{{data.setup.hrus | number(0)}}</td>
									</tr>
									<tr>
										<th>LSUs</th>
										<td>{{data.setup.lsus | number(0)}}</td>
									</tr>
									<tr>
										<th>Subbasins</th>
										<td>{{data.setup.subbasins | number(0)}}</td>
									</tr>
								</table>
							</b-col>
						</b-row>
					</div>
					<div v-if="page.tabIndex == 1" title="Hydrology">
						<p>
							Realistic hydrology is the foundation of any model.  Pay particular attention to evapotranspiration, baseflow and surface runoff ratios.
							Baseflow/streamflow ratios for the US are provided by the USGS, these data are accessible via the button below.
							The ranges specified here are general guidelines only, and may not apply to your simulation area.
						</p>

						<b-modal v-model="modals.hydrology.monthlyBasinValues" scrollable size="lg" title="Average monthly basin values">
							<div class="table-responsive">
								<table class="table table-sm table-striped nowrap-headers">
									<thead>
										<tr>
											<th>Mon</th>
											<th>Rain (MM)</th>
											<th>Snow Fall (MM)</th>
											<th>SURF Q (MM)</th>
											<th>LAT Q (MM)</th>
											<th>Water Yield (MM)</th>
											<th>ET (MM)</th>
											<th>Sed. Yield (T/HA)</th>
											<th>PET (MM)</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(m, i) in data.hydrology.monthlyBasinValues" :key="i">
											<td>{{m.mon}}</td>
											<td>{{m.rain | number(2)}}</td>
											<td>{{m.snowFall | number(2)}}</td>
											<td>{{m.surfQ | number(2)}}</td>
											<td>{{m.latQ | number(2)}}</td>
											<td>{{m.waterYield | number(2)}}</td>
											<td>{{m.et | number(2)}}</td>
											<td>{{m.sedYield | number(2)}}</td>
											<td>{{m.pet | number(2)}}</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div slot="modal-footer">
								<b-button type="button" variant="primary" @click="modals.hydrology.monthlyBasinValues = false">Close</b-button>
							</div>
						</b-modal>

						<b-modal v-model="modals.hydrology.baseflowMap" scrollable size="lg" title="Fraction of streamflow derived from baseflow">
							<p>
								<img class="img-fluid" :src="`${publicPath}swat-check/Baseflow_Map.png`" alt="Baseflow_Map.png" />
							</p>

							<div slot="modal-footer">
								<b-button type="button" variant="primary" @click="modals.hydrology.baseflowMap = false">Close</b-button>
							</div>
						</b-modal>
						
						<b-alert :show="data.hydrology.warnings.length > 0" variant="primary">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.hydrology.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<div id="hydrology" class="picture-holder">
							<span id="pet">PET<br />{{data.hydrology.pet | number(2)}}</span>
							<span id="et">{{data.hydrology.et | number(2)}}</span>
							<span id="etPlant">Plant ET<br />{{data.hydrology.etPlant | number(2)}}</span>
							<span id="etSoil">Soil ET<br />{{data.hydrology.etSoil | number(2)}}</span>
							<span id="precip">{{data.hydrology.precipitation | number(2)}}</span>
							<span id="irrigation">Irrigation<br />{{data.hydrology.irrigation | number(2)}}</span>
							<span id="tile">Tile<br />{{data.hydrology.tile | number(2)}}</span>
							<span id="cn">Average Curve Number<br />{{data.hydrology.averageCn | number(2)}}</span>
							<span id="surfacerunoff">{{data.hydrology.surfaceRunoff | number(2)}}</span>
							<span id="lateralflow">{{data.hydrology.lateralFlow | number(2)}}</span>
							<span id="returnflow">{{data.hydrology.returnFlow | number(2)}}</span>
							<span id="perc">{{data.hydrology.percolation | number(2)}}</span>
							<span id="revap">{{data.hydrology.revap | number(2)}}</span>
							<span id="recharge">{{data.hydrology.recharge | number(2)}}</span>
							<span id="hydrology-units">All Units mm</span>
						</div>

						<hr class="my-4" />

						<b-row>
							<b-col md="6">
								<h5>Water Balance Ratios</h5>
								<table class="table table-striped table-sm border-bottom">
									<tr>
										<th>Streamflow/Precipitation</th>
										<td>{{data.hydrology.streamflowPrecipitation | number(2)}}</td>
									</tr>
									<tr>
										<th>Baseflow/Total Flow</th>
										<td>{{data.hydrology.baseflowTotalFlow | number(2)}}</td>
									</tr>
									<tr>
										<th>Surface Runoff/Total Flow</th>
										<td>{{data.hydrology.surfaceRunoffTotalFlow | number(2)}}</td>
									</tr>
									<tr>
										<th>Percolation/Precipitation</th>
										<td>{{data.hydrology.percolationPrecipitation | number(2)}}</td>
									</tr>
									<tr>
										<th>Deep Recharge/Precipitation</th>
										<td>{{data.hydrology.deepRechargePrecipitation | number(2)}}</td>
									</tr>
									<tr>
										<th>ET/Precipitation</th>
										<td>{{data.hydrology.etPrecipitation | number(2)}}</td>
									</tr>
								</table>
							</b-col>
							<b-col md="6" lg="5" v-if="false">
								<p class="mb-2">
									<b-button @click="modals.hydrology.monthlyBasinValues = true" variant="primary">Average monthly basin values</b-button>
								</p><p>
									<b-button @click.prevent="modals.hydrology.baseflowMap = true" variant="primary">US baseflow map</b-button>
								</p>
							</b-col>
						</b-row>
					</div>
					<div v-if="page.tabIndex == 2" title="Sediment">
						<p>
							Sediment loss form the landscape is dependent upon many factors.  Sediment overestimation in SWAT+ is most commonly due to 
							inadequate biomass production.  This often occurs on specific land uses.  If your maximum upland sediment yield is excessive, 
							use the landuse summary tab to identify the problem land use.
						</p>

						<p>
							SWAT+ also modifies sediments to account for in-stream deposition and erosion of stream banks and channels.  
							Often there is little or no measured data to differentiate between upland sediment and in-stream sediment changes. 
							Streams may be either a net source of sediment, or a sink.  In-stream sediment modification is impacted by physical channel 
							characteristic’s (slope, width, depth, channel cover, and substrate characteristics) and the quantity of sediment and flow 
							from upstream.
						</p>

						<div v-if="data.sediment.warnings.length > 0">
							<h5 class="mt-3">Messages and Warnings</h5>
							<ul>
								<li v-for="(warning, i) in data.sediment.warnings" :key="i">{{warning}}</li>
							</ul>
						</div>

						<div id="sediment" class="picture-holder">
							<span id="maxupland">Maximum Upland Sediment Yield<br /> {{data.sediment.maxUplandSedimentYield | number(2)}} Mg/ha</span>
							<span id="surfacerunoffsed">Surface Runoff<br /> {{data.sediment.surfaceRunoff | number(2)}} mm/yr</span>
							<span id="avgupland">Average Upland Sediment Yield<br /> {{data.sediment.avgUplandSedimentYield | number(2)}} Mg/ha</span>
							<span id="inletsed">Inlet/Point Sources Sediment<br /> {{data.sediment.inletSediment | number(2)}} Mg/year</span>
							<span id="instreamsed">Instream Sediment Change<br /> {{data.sediment.inStreamSedimentChange | number(2)}} Mg/ha</span>
						</div>
					</div>
					<div v-if="page.tabIndex == 3" title="Nitrogen Cycle">
						<p>
							The nitrogen cycle is key to biomass production, which in turn impacts ET and sediment yield.
							The nitrogen cycle is complex, it is generally not possible to validate these routines outside a research setting.
							Of particular importance are the total applied nitrogen fertilizer and losses due to plant uptake, and volatilization and denitrification.
							Soils contain a large amount of organic nitrogen in the form of organic matter.  Large changes in initial and final nitrogen contents
							(in particular organic n) may indicate under or over fertilization during the simulation.
						</p>

						<b-alert :show="data.nitrogenCycle.warnings.length > 0" variant="primary">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.nitrogenCycle.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<div id="ncycle" class="picture-holder">
							<span id="initno3">
								Initial NO<sub>3</sub>: {{data.nitrogenCycle.initialNO3 | number(2)}}<br />
								Final NO<sub>3</sub>: {{data.nitrogenCycle.finalNO3 | number(2)}}
							</span>
							<span id="volatilization">{{data.nitrogenCycle.volatilization | number(2)}}</span>
							<span id="nfix">{{data.nitrogenCycle.nFixation | number(2)}}</span>
							<span id="denit">{{data.nitrogenCycle.denitrification | number(2)}}</span>
							<span id="inorgnh4">{{data.nitrogenCycle.nH4InOrgNFertilizer | number(2)}}</span>
							<span id="inorgno3">{{data.nitrogenCycle.nO3InOrgNFertilizer | number(2)}}</span>
							<span id="nplantuptake">{{data.nitrogenCycle.plantUptake | number(2)}}</span>
							<span id="nitrification">{{data.nitrogenCycle.nitrification | number(2)}}</span>
							<span id="nmineralization">{{data.nitrogenCycle.mineralization | number(2)}}</span>
							<span id="initorgn">
								Initial Org N: {{data.nitrogenCycle.initialOrgN | number(2)}}<br />
								Final Org N: {{data.nitrogenCycle.finalOrgN | number(2)}}
							</span>
							<span id="orgn">{{data.nitrogenCycle.orgNFertilizer | number(2)}}</span>
							<span id="activetostable">{{data.nitrogenCycle.activeToStableOrgN | number(2)}}</span>
							<span id="nresidue">{{data.nitrogenCycle.residueMineralization | number(2)}}</span>
							<span id="totaln">Total Fertilizer N: {{data.nitrogenCycle.totalFertilizerN | number(2)}}</span>

							<span id="ncycle-units">All units kg/ha</span>
						</div>
					</div>
					<div v-if="page.tabIndex == 4" title="Phosphorus Cycle">
						<p>
							The phosphorus cycle is of particular interest in watersheds with significant animal manure application.
							Soils contain a large reservoir of both mineral and organic phosphorus.  Large increases in mineral phosphorus
							content during the simulation often result from overfertilization with either commercial or manure phosphorus sources.
							This also means that phosphorus concentrations in runoff also increase during the simulation period.
							Plant uptake is the dominant loss pathway for soil phosphorus under most conditions.
						</p>

						<b-alert :show="data.phosphorusCycle.warnings.length > 0" variant="primary">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.phosphorusCycle.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<div id="pcycle" class="picture-holder">
							<span id="minp">
								Initial Min P: {{data.phosphorusCycle.initialMinP | number(2)}}<br />
								Final Min P: {{data.phosphorusCycle.finalMinP | number(2)}}
							</span>
							<span id="orgp">
								Initial Org P: {{data.phosphorusCycle.initialOrgP | number(2)}}<br />
								Final Org P: {{data.phosphorusCycle.finalOrgP | number(2)}}
							</span>
							<span id="totalp">Total Fertilizer P: {{data.phosphorusCycle.totalFertilizerP | number(2)}}</span>
							<span id="inorgp">{{data.phosphorusCycle.inOrgPFertilizer | number(2)}}</span>
							<span id="pplantuptake">{{data.phosphorusCycle.plantUptake | number(2)}}</span>
							<span id="pstableactive">{{data.phosphorusCycle.stableActive | number(2)}}</span>
							<span id="pactivesol">{{data.phosphorusCycle.activeSolution | number(2)}}</span>
							<span id="pmineralization">{{data.phosphorusCycle.mineralization | number(2)}}</span>
							<span id="orgpfert">{{data.phosphorusCycle.orgPFertilizer | number(2)}}</span>
							<span id="presidue">{{data.phosphorusCycle.residueMineralization | number(2)}}</span>

							<span id="pcycle-units">All units kg/ha</span>
						</div>
					</div>
					<div v-if="page.tabIndex == 5" title="Plant Growth">
						<p>
							Proper plant growth is key to accurate runoff and sediment predictions.  Problems in plant growth are often related to excessive
							stress due to temperature or the lack of water/nutrients.  The data presented here are basin averages, and may not reflect problems
							with individual land uses.  Carefully review the land use summary tab.
						</p>

						<b-row>
							<b-col md>
								<b-alert :show="data.plantGrowth.warnings.length > 0" variant="primary" class="mb-4">
									<h5>Messages and Warnings</h5>
									<ul class="mb-0">
										<li v-for="(warning, i) in data.plantGrowth.warnings" :key="i">{{warning}}</li>
									</ul>
								</b-alert>

								<table class="table table-striped table-sm border-bottom">
									<tr>
										<th>Temperature Stress Days</th>
										<td>{{data.plantGrowth.tempStressDays | number(2)}}</td>
									</tr>
									<tr>
										<th>Water Stress Days</th>
										<td>{{data.plantGrowth.waterStressDays | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrogen Stress Days</th>
										<td>{{data.plantGrowth.nStressDays | number(2)}}</td>
									</tr>
									<tr>
										<th>Phosphorus Stress Days</th>
										<td>{{data.plantGrowth.pStressDays | number(2)}}</td>
									</tr>
									<tr>
										<th>Soil Air Stress Days</th>
										<td>{{data.plantGrowth.soilAirStressDays | number(2)}}</td>
									</tr>
								</table>
							</b-col>
							<b-col md>
								<div id="plantgrowth" class="picture-holder">
									<span id="plantavg">
										Average Biomass: {{data.plantGrowth.avgBiomass | number(2)}} kg/ha<br />
										Average Yield: {{data.plantGrowth.avgYield | number(2)}} kg/ha
									</span>
									<span id="npremoved">
										N Removed in Yield: {{data.plantGrowth.nRemoved | number(2)}} kg/ha<br />
										P Removed in Yield: {{data.plantGrowth.pRemoved | number(2)}} kg/ha
									</span>
									<span id="totalnp">
										Total Fertilizer N: {{data.plantGrowth.totalFertilizerN | number(2)}} kg/ha<br />
										Total Fertilizer P: {{data.plantGrowth.totalFertilizerP | number(2)}} kg/ha
									</span>
									<span id="plantuptakenp">
										Plant Uptake N: {{data.plantGrowth.plantUptakeN | number(2)}} kg/ha<br />
										Plant Uptake P: {{data.plantGrowth.plantUptakeP | number(2)}} kg/ha
									</span>
								</div>
							</b-col>
						</b-row>
					</div>
					<div v-if="page.tabIndex == 6" title="Landscape Nutrient Losses">
						<p>
							Nutrient losses are a critical aspect of many studies.  The data presented here are losses from the landscape surface, which is delivered to reaches.
							These are basin averages. The link below contains a summary of edge of field nutrient losses from monitoring studies by individual crops.
							These data can be compared to SWAT+ predictions to verify the appropriate magnitude of predicted losses.
						</p>

						<b-alert :show="data.landscapeNutrientLosses.warnings.length > 0" variant="primary" class="mb-4">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.landscapeNutrientLosses.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<b-row>
							<b-col md>
								<h5>Nitrogen Losses (kg/ha)</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Total N Loss</th>
										<td>{{data.landscapeNutrientLosses.nLosses.totalLoss | number(2)}}</td>
									</tr>
									<tr>
										<th>Organic N</th>
										<td>{{data.landscapeNutrientLosses.nLosses.orgN | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrate Surface Runoff</th>
										<td>{{data.landscapeNutrientLosses.nLosses.surfaceRunoff | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrate Leached</th>
										<td>{{data.landscapeNutrientLosses.nLosses.leached | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrate Lateral Flow</th>
										<td>{{data.landscapeNutrientLosses.nLosses.lateralFlow | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrate Groundwater Yield</th>
										<td>{{data.landscapeNutrientLosses.nLosses.groundwaterYield | number(2)}}</td>
									</tr>
									<tr>
										<th>Solubility Ratio in Runoff</th>
										<td>{{data.landscapeNutrientLosses.nLosses.solubilityRatio | number(2)}}</td>
									</tr>
								</table>
							</b-col>
							<b-col md>
								<h5>Phosphorus Losses (kg/ha)</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Total P Loss</th>
										<td>{{data.landscapeNutrientLosses.pLosses.totalLoss | number(2)}}</td>
									</tr>
									<tr>
										<th>Organic P</th>
										<td>{{data.landscapeNutrientLosses.pLosses.orgP | number(2)}}</td>
									</tr>
									<tr>
										<th>Soluble P Surface Runoff</th>
										<td>{{data.landscapeNutrientLosses.pLosses.surfaceRunoff | number(2)}}</td>
									</tr>
									<tr>
										<th>Solubility Ratio in Runoff</th>
										<td>{{data.landscapeNutrientLosses.pLosses.solubilityRatio | number(2)}}</td>
									</tr>
								</table>
							</b-col>
						</b-row>

						<h5 class="mt-4">Measured Nutrient Losses by Crop and Tillage</h5>
						<p>
							From Harmel, D., et al.  2006 Compilation of Measured Nutrient Load Data for Agricultural Land Uses in the United States. <em>Journal of the American Water Resources Association</em> 42(5):1163-1178.
						</p>
						<p>
							<img class="img-fluid" :src="`${publicPath}swat-check/nut_croptype2.png`" alt="nut_croptype2.png" />
						</p>
						<p>
							<img class="img-fluid" :src="`${publicPath}swat-check/nut_croptype3.png`" alt="nut_croptype3.png" />
						</p>
					</div>
					<div v-if="page.tabIndex == 7" title="Land Use Summary">
						<p>
							Model errors are often isolated to a particular land use type.  If the land use is relatively minor, these issues
							may go unnoticed at the basin outlet during calibration.  Often, these minor land uses are the focus of scenario
							development, and errors become apparent after the investment of much calibration effort.
						</p>
						
						<b-alert :show="data.landUseSummary.warnings.length > 0" variant="primary" class="mb-4">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.landUseSummary.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<h5>Summary by Reported Land Use</h5>
						<p>
							This table contains a few important predictions summarized by land use.  These should be reviewed carefully.
						</p>

						<div>
							<b-table-simple small responsive striped table-class="table-th-nowrap">
								<b-thead>
									<b-tr>
										<b-th>LULC</b-th>
										<b-th>AREA ha</b-th>
										<b-th>CN</b-th>
										<b-th>AWC mm</b-th>
										<b-th>USLE_LS</b-th>
										<b-th>IRR mm</b-th>
										<b-th>PREC mm</b-th>
										<b-th>SURQ mm</b-th>
										<b-th>ET mm</b-th>
										<b-th>SED th</b-th>
										<b-th>NO3 kgh</b-th>
										<b-th>ORGN kgh</b-th>
										<b-th>BIOM th</b-th>
										<b-th>YLD th</b-th>
									</b-tr>
								</b-thead>
								<b-tbody>
									<b-tr v-for="(m, i) in data.landUseSummary.landUseRows" :key="i">
										<b-td>{{m.landUse}}</b-td>
										<b-td>{{m.area |number(2)}}</b-td>
										<b-td>{{m.cn |number(2)}}</b-td>
										<b-td>{{m.awc |number(2)}}</b-td>
										<b-td>{{m.usle_ls |number(2)}}</b-td>
										<b-td>{{m.irr |number(2)}}</b-td>
										<b-td>{{m.prec |number(2)}}</b-td>
										<b-td>{{m.surq |number(2)}}</b-td>
										<b-td>{{m.et |number(2)}}</b-td>
										<b-td>{{m.sed |number(2)}}</b-td>
										<b-td>{{m.no3 |number(2)}}</b-td>
										<b-td>{{m.orgn |number(2)}}</b-td>
										<b-td>{{m.biom |number(2)}}</b-td>
										<b-td>{{m.yld |number(2)}}</b-td>
									</b-tr>
								</b-tbody>
							</b-table-simple>
						</div>

						<div v-if="data.landUseSummary.hruLevelWarnings.length > 0">
							<h5>HRU Level Warnings</h5>
							<p>
								These are provided only to help isolate problem HRUs within a particular land use.
								We do not recommend that these be used during routine checking of model output.
							</p>
							<ul>
								<li v-for="(warning, i) in data.landUseSummary.hruLevelWarnings" :key="i">{{warning}}</li>
							</ul>
						</div>
					</div>
					<div v-if="page.tabIndex == 8" title="Instream Processes">
						<p>
							In-stream processes may have a large impact on sediment and nutrient loads.  It is difficult to gage appropriate values for these outputs.
							In-stream sediment change can be either positive or negative.  Typically streams are a net sink for nutrients.
							Channel geomorphology can provide some guidance as to the net contribution of in-stream processes.
						</p>

						<b-alert :show="data.instreamProcesses.warnings.length > 0" variant="primary" class="mb-4">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.instreamProcesses.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<b-row>
							<b-col md>
								<h5>Reach Report: Delivery ratio of segment (%)</h5>
								<b-table striped hover small :items="data.instreamProcesses.reaches" :fields="[{ key: 'id', label: 'RCH#'}, 'sediment', 'phosphorus', 'nitrogen']">
									<template v-slot:cell(sediment)="data">
										{{data.item.sediment | number(2)}}
									</template>
									<template v-slot:cell(phosphorus)="data">
										{{data.item.phosphorus | number(2)}}
									</template>
									<template v-slot:cell(nitrogen)="data">
										{{data.item.nitrogen | number(2)}}
									</template>
								</b-table>
							</b-col>
							<b-col md>
								<h5>Sediment Budget</h5>
								<table class="table table-striped table-definitions instream table-sm border-bottom mb-4">
									<tr>
										<th>Upland Sediment Yield</th>
										<td>{{data.instreamProcesses.uplandSedimentYield | number(2)}}</td>
										<td>Mg/ha</td>
									</tr>
									<tr>
										<th>Instream Sediment Change</th>
										<td>{{data.instreamProcesses.instreamSedimentChange | number(2)}}</td>
										<td>Mg/ha</td>
									</tr>
									<tr>
										<th>Channel Erosion</th>
										<td>{{data.instreamProcesses.channelErosion | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Channel Deposition</th>
										<td>{{data.instreamProcesses.channelDeposition | number(2)}}</td>
										<td>%</td>
									</tr>
								</table>

								<h5>Instream Nutrient Modification</h5>
								<table class="table table-striped table-definitions instream table-sm border-bottom mb-4">
									<tr>
										<th>Total Nitrogen</th>
										<td>{{data.instreamProcesses.totalN | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Total Phosphorus</th>
										<td>{{data.instreamProcesses.totalP | number(2)}}</td>
										<td>%</td>
									</tr>
								</table>

								<h5>Instream Water Budget</h5>
								<table class="table table-striped table-definitions instream table-sm border-bottom">
									<tr>
										<th>Total Streamflow Losses</th>
										<td>{{data.instreamProcesses.totalStreamflowLosses | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Evaporation Loss</th>
										<td>{{data.instreamProcesses.evaporationLoss | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Seepage Loss</th>
										<td>{{data.instreamProcesses.seepageLoss | number(2)}}</td>
										<td>%</td>
									</tr>
								</table>
							</b-col>
						</b-row>
					</div>
					<div v-if="page.tabIndex == 9" title="Point Sources">
						<p>
							Point sources constantly discharge pollutants to streams.  These are an optional feature in SWAT+.
							These summaries are presented so that the relative contribution of these sources can be verified.
							Point sources contributions are so varied that there is no reasonable range which can be applied to all basins.
						</p>

						<b-alert :show="data.pointSources.warnings.length > 0" variant="primary" class="mb-4">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.pointSources.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<b-row>
							<b-col lg>
								<h5>Total Subbasin Load</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Flow</th>
										<td>{{data.pointSources.subbasinLoad.flow | number(4)}}</td>
										<td>cms</td>
									</tr>
									<tr>
										<th>Sediment</th>
										<td>{{data.pointSources.subbasinLoad.sediment | number(2)}}</td>
										<td>Mg/yr</td>
									</tr>
									<tr>
										<th>Nitrogen</th>
										<td>{{data.pointSources.subbasinLoad.nitrogen | number(2)}}</td>
										<td>kg/yr</td>
									</tr>
									<tr>
										<th>Phosphorus</th>
										<td>{{data.pointSources.subbasinLoad.phosphorus | number(2)}}</td>
										<td>kg/yr</td>
									</tr>
								</table>
							</b-col>
							<b-col lg>
								<h5>Total Point Source + Inlet Load</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Flow</th>
										<td>{{data.pointSources.pointSourceInletLoad.flow | number(2)}}</td>
										<td>cms</td>
									</tr>
									<tr>
										<th>Sediment</th>
										<td>{{data.pointSources.pointSourceInletLoad.sediment | number(2)}}</td>
										<td>Mg/yr</td>
									</tr>
									<tr>
										<th>Nitrogen</th>
										<td>{{data.pointSources.pointSourceInletLoad.nitrogen | number(2)}}</td>
										<td>kg/yr</td>
									</tr>
									<tr>
										<th>Phosphorus</th>
										<td>{{data.pointSources.pointSourceInletLoad.phosphorus | number(2)}}</td>
										<td>kg/yr</td>
									</tr>
								</table>
							</b-col>
							<b-col lg>
								<h5>Load from Inlet + PS (%)</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Flow</th>
										<td>{{data.pointSources.fromInletAndPointSource.flow | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Sediment</th>
										<td>{{data.pointSources.fromInletAndPointSource.sediment | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Nitrogen</th>
										<td>{{data.pointSources.fromInletAndPointSource.nitrogen | number(2)}}</td>
										<td>%</td>
									</tr>
									<tr>
										<th>Phosphorus</th>
										<td>{{data.pointSources.fromInletAndPointSource.phosphorus | number(2)}}</td>
										<td>%</td>
									</tr>
								</table>
							</b-col>
						</b-row>
					</div>
					<div v-if="page.tabIndex == 10" title="Reservoirs">
						<p>
							Reservoirs are an optional feature in SWAT+.   The hydrology of basins with large reservoirs may be completely dominated by reservoir processes and release rates.
							The data presented below is an average of all reservoirs; <a href="#" @click.prevent="modals.reservoirs.table = true">see data for individual reservoirs</a>.
							The statistics presented here are designed to identify common reservoir issues.   The use of user specified release rate may cause a reservoir to
							grow continuously or run completely dry.  These common issues can be detected via the final/initial volume ratio and fraction of period empty statistics below.
						</p>

						<b-alert :show="data.reservoirs.warnings.length > 0" variant="primary" class="mb-4">
							<h5>Messages and Warnings</h5>
							<ul class="mb-0">
								<li v-for="(warning, i) in data.reservoirs.warnings" :key="i">{{warning}}</li>
							</ul>
						</b-alert>

						<b-modal v-model="modals.reservoirs.table" scrollable size="lg" title="Detailed Reservoir Performance Output">
							<div class="table-responsive">
								<table class="table table-striped">
									<thead>
										<tr>
											<th>RES#</th>
											<th>Sediment</th>
											<th>Phosphorus</th>
											<th>Nitrogen</th>
											<th>Vol. Ratio</th>
											<th>Fraction Empty</th>
											<th>Seepage</th>
											<th>Evap. Loss</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(m, i) in data.reservoirs.reservoirRows" :key="i">
											<td>{{m.id}}</td>
											<td>{{m.sediment | number(2)}}</td>
											<td>{{m.phosphorus | number(2)}}</td>
											<td>{{m.nitrogen | number(2)}}</td>
											<td>{{m.volumeRatio | number(2)}}</td>
											<td>{{m.fractionEmpty | number(2)}}</td>
											<td>{{m.seepage | number(2)}}</td>
											<td>{{m.evapLoss | number(2)}}</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div slot="modal-footer">
								<b-button type="button" variant="primary" @click="modals.reservoirs.table = false">Close</b-button>
							</div>
						</b-modal>

						<b-row>
							<b-col md="4">
								<h5>Average Trapping Efficiency (%)</h5>
								<table class="table table-striped table-definitions table-sm border-bottom mb-4">
									<tr>
										<th>Sediment</th>
										<td class="text-right">{{data.reservoirs.avgTrappingEfficiencies.sediment | number(2)}}</td>
									</tr>
									<tr>
										<th>Nitrogen</th>
										<td class="text-right">{{data.reservoirs.avgTrappingEfficiencies.nitrogen | number(2)}}</td>
									</tr>
									<tr>
										<th>Phosphorus</th>
										<td class="text-right">{{data.reservoirs.avgTrappingEfficiencies.phosphorus | number(2)}}</td>
									</tr>
								</table>

								<h5>Average Water Loss (%)</h5>
								<table class="table table-striped table-definitions table-sm border-bottom mb-4">
									<tr>
										<th>Total Removed + Losses</th>
										<td class="text-right">{{data.reservoirs.avgWaterLosses.totalRemoved | number(2)}}</td>
									</tr>
									<tr>
										<th>Evaporation</th>
										<td class="text-right">{{data.reservoirs.avgWaterLosses.evaporation | number(2)}}</td>
									</tr>
									<tr>
										<th>Seepage</th>
										<td class="text-right">{{data.reservoirs.avgWaterLosses.seepage | number(2)}}</td>
									</tr>
								</table>

								<h5>Average Reservoir Trends</h5>
								<table class="table table-striped table-definitions table-sm border-bottom">
									<tr>
										<th>Number of Reservoirs</th>
										<td class="text-right">{{data.reservoirs.avgReservoirTrends.numberReservoirs | number(2)}}</td>
									</tr>
									<tr>
										<th>Final/Initial Volume (Max)</th>
										<td class="text-right">{{data.reservoirs.avgReservoirTrends.maxVolume | number(2)}}</td>
									</tr>
									<tr>
										<th>Final/Initial Volume (Min)</th>
										<td class="text-right">{{data.reservoirs.avgReservoirTrends.minVolume | number(2)}}</td>
									</tr>
									<tr>
										<th>Fraction of Period Empty (Max)</th>
										<td class="text-right">{{data.reservoirs.avgReservoirTrends.fractionEmpty | number(2)}}</td>
									</tr>
								</table>
							</b-col>
							<b-col md>
								<p>
									<img class="img-fluid" :src="`${publicPath}swat-check/res.jpg`" alt="res image" />
								</p>
							</b-col>
						</b-row>
					</div>

					<action-bar>
						<b-button variant="light" @click="nextTab(-1)" class="border mr-2" :disabled="page.tabIndex == 0" title="Previous tab"><font-awesome-icon icon="chevron-left" /></b-button>
						<b-button variant="light" @click="nextTab(1)" class="border mr-2" :disabled="page.tabIndex == page.tabs.length - 1" title="Next tab"><font-awesome-icon icon="chevron-right" /></b-button>
						<b-button type="button" variant="secondary" @click="exit" class="ml-auto">Exit SWAT+ Editor</b-button>
					</action-bar>
				</section>
			</div>
		</div>
	</project-container>
</template>

<script>
import { runProcess } from '@/plugins/electron-process';

export default {
	name: 'Check',
	mixins: [runProcess],
	data() {
		return {
			publicPath: process.env.BASE_URL,
			page: {
				loading: false,
				error: null,
				show: {
					info: true,
					hyd: false
				},
				tabIndex: 0,
				tabs: [
					"Information",
					"Hydrology",
					"Sediment",
					"Nitrogen Cycle",
					"Phosphorus Cycle",
					"Plant Growth",
					"Landscape Nutrient Losses",
					"Land Use Summary",
					"Instream Processes",
					"Point Sources",
					"Reservoirs"
				]
			},
			config: {
                input_files_dir: null,
				input_files_last_written: null,
				swat_last_run: null,
				output_last_imported: null
			},
			data: {
				setup: {},
				hydrology: {},
				nitrogenCycle: {},
				phosphorusCycle: {},
				plantGrowth: {},
				landscapeNutrientLosses: {},
				landUseSummary: {},
				pointSources: {},
				reservoirs: {},
				instreamProcesses: {},
				sediment: {},
			},
			modals: {
				hydrology: {
					monthlyBasinValues: false,
					baseflowMap: false
				},
				reservoirs: {
					table: false
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
		async get() {
			this.page.loading = true;
			this.page.error = null;

			if (!this.currentProject.isLte) {
				try {
					const response = await this.$http.get(`setup/run-info/${this.projectDbUrl}`);
					this.log(response.data);
					this.config = response.data.config;

					if (!this.isNullOrEmpty(this.config.output_last_imported)) {
						let outputDb = this.outputDbPath(this.config.input_files_dir);
						let data = {
							'project_db': this.currentProject.projectDb,
							'output_db': outputDb
						}
						const response2 = await this.$http.post(`output/check`, data);
						this.log(response2.data);
						this.data = response2.data;

						if (!response.data.has_observed_weather) {
							this.data.hydrology.warnings.push('You are using simulated precipitation data; if you intend to calibrate, you should used measured precipitation data');
						}

						if (response.data.print.prt.nyskip < 1) {
							this.data.hydrology.warnings.push('It is highly recomended that you use at least 1 year of model warmup; 2-5 years is better');
						}

						if (this.data.setup.swatVersion === 'development') {
							this.data.setup.swatVersion = this.swatplus;
						}
					}
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to get SWAT+ Check data.');
				}
			}
			
            this.page.loading = false;
		},
		nextTab(position) {
			var maxTabPos = this.page.tabs.length - 1;
			this.page.tabIndex += position;

			if (this.page.tabIndex > maxTabPos)
				this.page.tabIndex = 0;
			if (this.page.tabIndex < 0)
				this.page.tabIndex = maxTabPos;
		}
	}
}
</script>

<style>
	table.instream td {
		width: 1%;
		white-space: nowrap;
		text-align: right;	
	}

	table.instream th {
		width: 85%;
	}

	.picture-holder {
		background: no-repeat 0 0;
		font-size: 0.8em;
		line-height: 1.4em;
		margin: 0 auto;
		position: relative;
	}

	.picture-holder span {
		background: #fff;
		font-weight: bold;
		padding: 0 2px;
		position: absolute;
		text-align: center;
	}

	#hydrology {
		background-image: url(~@/assets/swat-check/hydro.png);
		height: 491px;
		width: 650px;
	}

	#hydrology #et {
		top: 65px;
		left: 130px;
	}
	
	#hydrology #etPlant {
		top: 95px;
		left: 0;
		width: 50px;
	}

	#hydrology #etSoil {
		top: 145px;
		left: 0;
		width: 50px;
	}

	#hydrology #pet {
		top: 45px;
		left: 0px;
		width: 50px;
	}

	#hydrology #precip {
		top: 110px;
		left: 410px;
	}

	#hydrology #irrigation {
		top: 100px;
		left: 480px;
		width: 150px;
	}

	#hydrology #tile {
		top: 150px;
		left: 480px;
		width: 150px;
	}

	#hydrology #cn {
		top: 50px;
		left: 480px;
		width: 150px;
	}

	#hydrology #surfacerunoff {
		top: 275px;
		left: 545px;
	}

	#hydrology #lateralflow {
		top: 315px;
		left: 450px;
	}

	#hydrology #returnflow {
		top: 355px;
		left: 480px;
	}

	#hydrology #perc {
		top: 350px;
		left: 320px;
	}

	#hydrology #revap {
		top: 350px;
		left: 150px;
	}

	#hydrology #recharge {
		top: 445px;
		left: 320px;
	}

	#hydrology #hydrology-units {
		bottom: 5px;
		right: 5px;
	}

	#sediment {
		background-image: url(~@/assets/swat-check/WatershedDisplay.jpg);
		height: 396px;
		width: 628px;
	}

	#sediment #maxupland {
		top: 25px;
		left: 400px;
	}

	#sediment #surfacerunoffsed {
		top: 70px;
		left: 150px;
	}

	#sediment #avgupland {
		top: 130px;
		left: 30px;
	}

	#sediment #inletsed {
		top: 220px;
		left: 125px;
	}

	#sediment #instreamsed {
		top: 220px;
		left: 370px;
	}

	#ncycle {
		background-image: url(~@/assets/swat-check/NCycle.png);
		height: 362px;
		width: 800px;
	}

	#ncycle #initno3 {
		top: 5px;
		left: 5px;
	}

	#ncycle #volatilization {
		top: 115px;
		left: 70px;
	}

	#ncycle #nfix {
		top: 77px;
		left: 242px;
	}

	#ncycle #denit {
		top: 115px;
		left: 275px;
	}

	#ncycle #inorgnh4 {
		top: 160px;
		left: 85px;
	}

	#ncycle #inorgno3 {
		top: 146px;
		left: 317px;
	}

	#ncycle #nplantuptake {
		top: 200px;
		left: 240px;
	}

	#ncycle #nitrification {
		top: 240px;
		left: 115px;
	}

	#ncycle #nmineralization {
		top: 240px;
		left: 300px;
	}

	#ncycle #totaln {
		top: 320px;
		left: 30px;
	}

	#ncycle #initorgn {
		top: 5px;
		left: 405px;
	}

	#ncycle #orgn {
		top: 135px;
		left: 445px;
	}

	#ncycle #activetostable {
		top: 225px;
		left: 520px;
	}

	#ncycle #nresidue {
		top: 315px;
		left: 660px;
	}

	#ncycle #ncycle-units {
		top: 5px;
		right: 5px;
	}

	#pcycle {
		background-image: url(~@/assets/swat-check/PCycle.png);
		height: 362px;
		width: 800px;
	}

	#pcycle #minp {
		top: 5px;
		left: 5px;
	}

	#pcycle #orgp {
		top: 5px;
		left: 405px;
	}

	#pcycle #totalp {
		top: 65px;
		left: 30px;
	}

	#pcycle #inorgp {
		top: 110px;
		left: 305px;
	}

	#pcycle #pplantuptake {
		top: 150px;
		left: 215px;
	}

	#pcycle #pstableactive {
		top: 220px;
		left: 90px;
	}

	#pcycle #pactivesol {
		top: 220px;
		left: 205px;
	}

	#pcycle #pmineralization {
		top: 255px;
		left: 340px;
	}

	#pcycle #orgpfert {
		top: 180px;
		left: 480px;
	}

	#pcycle #presidue {
		top: 315px;
		left: 660px;
	}

	#pcycle #pcycle-units {
		top: 5px;
		right: 5px;
	}

	#plantgrowth {
		background-image: url(~@/assets/swat-check/plant.png);
		height: 458px;
		width: 450px;
	}

	#plantgrowth span {
		text-align: right;
	}

	#plantgrowth #plantavg {
		top: 5px;
		left: 5px;
	}

	#plantgrowth #npremoved {
		top: 50px;
		left: 230px;
	}

	#plantgrowth #totalnp {
		top: 220px;
		left: 270px;
	}

	#plantgrowth #plantuptakenp {
		bottom: 10px;
		left: 260px;
	}
</style>