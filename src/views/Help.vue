<template>
	<div id="main-panel" class="no-sub">
		<section id="main">
			<h1>About SWAT+ Editor</h1>

			<p>
				SWAT+ Editor is an interface to SWAT+ that allows users to import a project from GIS, modify SWAT+ input, write the text files, and run the model.
			</p>

			<p class="mb-4">
				<open-in-browser url="https://swatplus.gitbook.io/docs/" text="Read the documentation" cssClass="btn btn-primary" />
				<open-in-browser url="https://bitbucket.org/swatplus/swatplus.editor/issues?status=new&amp;status=open" text="Report an error, bug, or feature request" cssClass="btn btn-info ml-1" />
			</p>

			<h2>SWAT+ Resources</h2>

			<ul class="plain-border">
				<li><open-in-browser url="https://swat.tamu.edu/plus" text="SWAT+ Website" /></li>
				<li><open-in-browser url="https://groups.google.com/d/forum/swatplus-editor" text="SWAT+ Editor user discussion group" /></li>
				<li><open-in-browser url="https://bitbucket.org/swatplus/swatplus.editor" text="SWAT+ Editor source code repository" /></li>
			</ul>

			<div class="card my-4 bg-light">
				<div class="card-body">
				<h2>About SWAT+</h2>
				<p>
					The Soil and Water Assessment Tool Plus (SWAT+) is a public domain model jointly developed by the 
					USDA Agricultural Research Service (USDA-ARS) and Texas A&M AgriLife Research, part of The Texas A&M University System. 
					SWAT+ is a small watershed to river basin-scale model to simulate the quality and quantity of surface and ground water and predict 
					the environmental impact of land use, land management practices, and climate change. SWAT is widely used in assessing soil erosion 
					prevention and control, non-point source pollution control and regional management in watersheds.
				</p>

				<h2 class="mt-3">Disclaimer</h2>
				<p>
					The information contained within this software is offered as a public service. It is the responsibility of the user to verify the accuracy, completeness, timeliness, quality, or suitability for a particular use of the information/ software provided. Neither Grassland, Soil & Water Research Laboratory (GSWRL), Blackland Research Center (BRC), nor Texas A&M AgriLife Research (TALR) make any claims, guarantees, or warranties about the accuracy, completeness, timeliness, quality, or suitability for a particular use of this software. GSWRL, BRC, and TALR disclaim any and all liability for any claims or damages that may result from providing the website or the information/ software contained within. The user of this software assumes all liability and waives any and all claims or causes of action against GSWRL, BRC, and TALR for all uses of and reliance on the information/ software. GSWRL, BRC, and TALR do not endorse any commercial entities, products, consultants, or documentation that may be referenced in this software. The information contained within this software is provided for general information purposes, and is not intended to be a solicitation or an offer to sell in connection with any product or service. Any reference to commercial entities, products, or consultants is for information purposes only.
				</p>
				</div>
			</div>

			<page-loading :loading="page.loading"></page-loading>
			<error-alert :text="page.error"></error-alert>
			<div class="card" v-if="!page.loading">
				<div class="card-header">
					<h4 class="mb-0">Troubleshooting</h4>
				</div>
				<div class="card-body">
					<p>
						Trouble running SWAT+ Editor? Please send the information below to the user groups or issue tracker
						along with your error message.
					</p>
					<div>SWAT+ Editor Version: {{ version }}</div>
					<div>Platform: {{ platform }}</div>
					<div>Python Mode: {{ python ? 'Yes' : 'No' }}</div>
					<div>Python Version: {{ apiCheck.pythonVersion }}</div>
					<div>API Check: {{ apiCheck.editor }}</div>
					<div>API Port: {{ port }}</div>
					<div>Development Mode: {{ devMode ? 'Yes' : 'No' }}</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
const remote = window.require('electron').remote;

export default {
	name: 'Help',
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			port: remote.getGlobal('api_port'),
			devMode: remote.getGlobal('dev_mode'),
			apiCheck: {
				editor: '',
				pythonVersion: 'N/A'
			}
		}
	},
	async created() {
		await this.get();
	},
	watch: {
		'$route': 'get'
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.$http.get('/');
				this.apiCheck = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to connect to SWAT+ API.');
				this.apiCheck.editor = 'API call unsuccessful';
			}
			
            this.page.loading = false;
		}
	}
}
</script>