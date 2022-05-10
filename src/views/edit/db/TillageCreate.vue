<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="tillage.til" docs-path="databases">
			<router-link to="/edit/db/tillage">Tillage</router-link>
			/ Create
		</file-header>

		<edit-form show-description show-range
			:item="item" 
			:vars="vars" 
			api-url="db/tillage"
			redirect-route="Tillage" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'TillageCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'tillage_til'
			},
			page: {
				loading: true,
				error: null
			},
			item: {
				name: null,
				description: null
			},
			vars: []
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
				const response = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
                this.vars = response.data;
                
                let keys = Object.keys(this.vars);
                for (let i = 0; i < keys.length; i++) {
					let k = this.vars[keys[i]];
                    this.item[keys[i]] = k.type == 'string' ? k.default_text : k.default_value;
                }
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>