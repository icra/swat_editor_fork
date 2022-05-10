<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="fire.ops" docs-path="land-use-management#fire">
			<router-link to="/edit/lum/ops">Operations</router-link> 
			/ <router-link to="/edit/lum/ops/fire">Fire</router-link> 
			/ Create
		</file-header>

		<edit-form show-description show-range
			:item="item" 
			:vars="vars" 
			api-url="ops/fire"
			redirect-route="OperationsFire" />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'OperationsFireCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'fire_ops'
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
                for (let k of keys) {
					let v = this.vars[k];
                    this.item[k] = v.type == 'string' ? v.default_text : v.default_value;
                }
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>