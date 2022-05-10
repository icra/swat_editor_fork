<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="codes.bsn" docs-path="basin">
			Basin Codes
		</file-header>

		<p>
			To use your own potential ET file, select "pet.cli" followed by "3 - Read in potential ET values" from the form below.
			Copy your pet.cli file to your <open-file :file-path="txtInOut">input files directory</open-file>. 
			See the <open-in-browser url="https://swatplus.gitbook.io/docs/user/editor/inputs/basin" text="basin documentation" /> for formatting.
		</p>

		<edit-form show-description show-range is-update hide-name no-id hide-copy
			:item="item" 
			:vars="vars" 
			api-url="basin/codes"
			redirect-route="BasinCodes" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'BasinCodes',
	components: {
		EditForm
	},
	data() {
		return {
			page: {
				loading: false,
				error: null
			},
			item: {},
			vars: []
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

            try {
				const response = await this.$http.get(`basin/codes/${this.projectDbUrl}`);
				this.item = response.data;

				const response2 = await this.$http.get(`vars/codes_bsn/${this.appPath}`);
				this.vars = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get basin information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>