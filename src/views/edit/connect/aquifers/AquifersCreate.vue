 <template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="aquifer.con" docs-path="connections/aquifers">
			<router-link to="/edit/aquifers">Aquifers</router-link>
			/ Create
		</file-header>

		<aquifers-form :item="item" :api-url="apiUrl" :vars="vars"></aquifers-form>
	</project-container>
</template>

<script>
import AquifersForm from './AquifersForm.vue';

export default {
	name: 'AquifersCreate',
	components: {
		AquifersForm
	},
	data() {
		return {
			apiUrl: 'aquifers',
			paths: {
				vars: 'aquifer_aqu'
			},
			page: {
				loading: true,
				error: null
			},
			item: {
				connect: {
					name: null,
					area: 0,
					lat: 0,
					lon: 0,
					elev: null,
					wst_name: null
				},
				props: {},
				outflow: []
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
				this.item.props = this.setVars(this.item.props, this.vars);
				this.item.props.init = { id: 1 };
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script> 