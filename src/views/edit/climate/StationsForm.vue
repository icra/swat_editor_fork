<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>

		<b-alert variant="primary" :show="!isUpdate">
			When creating a weather station manually, it does not automatically get assigned to your spatial objects.
			You will need to edit each spatial object and assign it this weather station in order to use it.
			To automatically assign weather stations, use the import function for weather generators or observed weather data.
		</b-alert>
		
		<b-form @submit.prevent="save">
			<b-form-group label="Name" :invalid-feedback="requiredFeedback($v.station.name)">
				<b-form-input type="text" v-model.trim="$v.station.name.$model" required autofocus maxLength="16" 
						:state="getValidState($v.station.name)"  
						v-b-tooltip.hover.bottom="'Must be unique and cannot contain spaces'" />
			</b-form-group>

			<b-form-group label="Weather generator">
				<type-ahead-and-go :show-button="isUpdate"
					v-model.trim="$v.station.wgn_name.$model"
					:value="station.wgn_name"
					table-name="wgn" route-name="WgnEdit"></type-ahead-and-go>
			</b-form-group>
			
			<b-row>
				<b-col sm>
					<b-form-group label="Latitude" :invalid-feedback="requiredFeedback($v.station.lat)">
						<b-form-input v-model.number.trim="$v.station.lat.$model" type="number" required step="any" :state="getValidState($v.station.lat)"></b-form-input>
					</b-form-group>
				</b-col>
				<b-col sm>
					<b-form-group label="Longitude" :invalid-feedback="requiredFeedback($v.station.lon)">
						<b-form-input v-model.number.trim="$v.station.lon.$model" type="number" required step="any" :state="getValidState($v.station.lon)"></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>

			<b-alert variant="primary" show>
				Important: when entering an observed weather file name below, you may start typing to search for existing weather files adding during the import step.
				If adding observed files manually, just type the name of the file (e.g., p326953.pcp), and put that file in the directory you plan to write input files (e.g., your TxtInOut).
				Files must be in SWAT+ format. If your weather data is in SWAT2012 format or from the Global Weather CFSR website, please use the import step to convert them to SWAT+.
			</b-alert>

			<table class="table edit">
				<thead class="thead-light">
					<tr>
						<th></th>
						<th class="text-center min">Simulated</th>
						<th>Observed data file name</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Precipitation</th>
						<td class="text-center"><b-form-checkbox v-model="form.isSim.pcp" @change="checkSim"></b-form-checkbox></td>
						<td><type-ahead show-preview v-if="!form.isSim.pcp" v-model="station.pcp" :value="station.pcp" src=":keyword" :fetch="getPcpFiles" :getResponse="getDataResponse" v-b-tooltip.hover.bottom="form.obsNote" /></td>
					</tr>
					<tr>
						<th>Temperature</th>
						<td class="text-center"><b-form-checkbox v-model="form.isSim.tmp" @change="checkSim"></b-form-checkbox></td>
						<td><type-ahead show-preview v-if="!form.isSim.tmp" v-model="station.tmp" :value="station.tmp" src=":keyword" :fetch="getTmpFiles" :getResponse="getDataResponse" v-b-tooltip.hover.bottom="form.obsNote" /></td>
					</tr>
					<tr>
						<th>Solar radiation</th>
						<td class="text-center"><b-form-checkbox v-model="form.isSim.slr" @change="checkSim"></b-form-checkbox></td>
						<td><type-ahead show-preview v-if="!form.isSim.slr" v-model="station.slr" :value="station.slr" src=":keyword" :fetch="getSlrFiles" :getResponse="getDataResponse" v-b-tooltip.hover.bottom="form.obsNote" /></td>
					</tr>
					<tr>
						<th>Relative humidity</th>
						<td class="text-center"><b-form-checkbox v-model="form.isSim.hmd" @change="checkSim"></b-form-checkbox></td>
						<td><type-ahead show-preview v-if="!form.isSim.hmd" v-model="station.hmd" :value="station.hmd" src=":keyword" :fetch="getHmdFiles" :getResponse="getDataResponse" v-b-tooltip.hover.bottom="form.obsNote" /></td>
					</tr>
					<tr>
						<th>Wind speed</th>
						<td class="text-center"><b-form-checkbox v-model="form.isSim.wnd" @change="checkSim"></b-form-checkbox></td>
						<td><type-ahead show-preview v-if="!form.isSim.wnd" v-model="station.wnd" :value="station.wnd" src=":keyword" :fetch="getWndFiles" :getResponse="getDataResponse" v-b-tooltip.hover.bottom="form.obsNote" /></td>
					</tr>
					<tr>
						<th>Wind direction</th>
						<td class="text-center"></td>
						<td><type-ahead show-preview v-model="station.wnd_dir" :value="station.wnd_dir" src=":keyword" :fetch="getWndDirFiles" :getResponse="getDataResponse" /></td>
					</tr>
					<tr>
						<th class="min">Atmospheric deposition</th>
						<td class="text-center"></td>
						<td><type-ahead show-preview v-model="station.atmo_dep" :value="station.atmo_dep" src=":keyword" :fetch="getAtmoDepFiles" :getResponse="getDataResponse" /></td>
					</tr>
				</tbody>
			</table>

			<action-bar>
				<save-button :saving="page.saving" />
				<back-button />
			</action-bar>
		</b-form>
	</div>
</template>

<style scoped>
table.edit tbody th {
	font-weight: normal;
	padding-bottom: 0.9rem;
	padding-top: 0.9rem;
}
</style>

<script>
import { required, decimal } from 'vuelidate/lib/validators';

export default {
	name: 'StationsForm',
	props: {
		isUpdate: {
			type: Boolean,
			default: false
		},
		station: {
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
				saving: false
			},
			form: {
				isSim: {
					pcp: true,
					tmp: true,
					slr: true,
					hmd: true,
					wnd: true
				},
				obsNote: 'If the observed file is left blank, simulated is used by default'
			}
		}
	},
	validations: {
		station: {
			name: { required },
			lat: { required, decimal },
			lon: { required, decimal },
			wgn_name: {},
			pcp: {},
			tmp: {},
			slr: {},
			hmd: {},
			wnd: {},
			wnd_dir: {},
			atmo_dep: {}
		}
	},
	created() {
		this.get();
	},
	methods: {
		get() {
			if (this.isUpdate) {
				this.form.isSim = {
					pcp: this.isSim(this.station.pcp),
					tmp: this.isSim(this.station.tmp),
					slr: this.isSim(this.station.slr),
					hmd: this.isSim(this.station.hmd),
					wnd: this.isSim(this.station.wnd)
				};
			}
		},
		isSim(value) {
			if (value == 'sim' || value == '' || value == null || value == undefined)
				return true;

			return false;
		},
		checkSim() {
			if (this.form.isSim.pcp) this.station.pcp = null;
			if (this.form.isSim.tmp) this.station.tmp = null;
			if (this.form.isSim.slr) this.station.slr = null;
			if (this.form.isSim.hmd) this.station.hmd = null;
			if (this.form.isSim.wnd) this.station.wnd = null;
		},
		putDb(data) {
			if (this.isUpdate)
				return this.$http.put(`climate/stations/${this.station.id}/${this.projectDbUrl}`, data);
			else
				return this.$http.post(`climate/stations/post/${this.projectDbUrl}`, data);
		},
		getFiles(type, name) {
			return this.$http.get(`climate/stations/files/${type}/${name}/${this.projectDbUrl}`);
		},
		getPcpFiles(name) {
			return this.getFiles('pcp', name);
		},
		getTmpFiles(name) {
			return this.getFiles('tmp', name);
		},
		getSlrFiles(name) {
			return this.getFiles('slr', name);
		},
		getHmdFiles(name) {
			return this.getFiles('hmd', name);
		},
		getWndFiles(name) {
			return this.getFiles('wnd', name);
		},
		getWndDirFiles(name) {
			return this.getFiles('wnd_dir', name);
		},
		getAtmoDepFiles(name) {
			return this.getFiles('atmo_dep', name);
		},
		async save() {
			this.page.error = null;
			this.page.saving = true;
			this.$v.station.$touch();

			if (this.$v.station.$invalid) {
				this.page.error = 'Please fix the errors below and try again.';
			} else {
				let station = this.station;
				station.name = this.validName(this.station.name);
				
				try {
					const response = await this.putDb(station);

					if (this.isUpdate)
						this.$bvToast.show('changes-saved');
					else
						this.$router.push({ name: 'Stations'});
				} catch (error) {
					this.page.error = this.logError(error, 'Unable to save changes to database.');
				}
			}

			this.page.saving = false;
		}
	}
}
</script>