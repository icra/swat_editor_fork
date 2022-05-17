<!--ICRA Joan Saló-->
<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="recall.con" docs-path="connections/recall">
			<router-link to="/edit/recall">Point Source</router-link>
			/ <router-link :to="`/edit/recall/edit/${$route.params.id}`">{{rec.name}}</router-link>
			/ Create
		</file-header>

		<p>
			Record Type: {{rec.rec_typ_name}}
		</p>

		<edit-form show-range hide-name
			:item="item"
			:vars="vars"
			api-url="/recall_pollutants/data/item"
			:redirect-route="`/edit/recall/edit/${$route.params.id}`" redirect-path
		/>
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'RecallDataCreatePollutant',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'recall_pollutants_dat'
			},
			page: {
				loading: true,
				error: null
			},
			item: {},
			vars: [],
			rec: {
				name: null,
				rec_typ: null,
				rec_typ_name: null
			},
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		async get() {
			this.page.loading = true;
			this.page.error = null;

            let item = this.$parent.$parent.item;
			this.rec.name = item.connect.name;
			this.rec.rec_typ = item.props.rec_typ;
			this.rec.rec_typ_name = this.$parent.$parent.getRecTypDescription(this.rec.rec_typ);

            try {
				const response = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);

				let dbUrl = this.useDatasetsDb ? this.datasetsDbUrl : this.projectDbUrl;


                this.vars = response.data;
                this.item = this.setVars(this.item, this.vars);
				this.item.recall_rec_id = this.$route.params.id;

				const pollutants_created = await this.$http.get(`db/pollutants/list/${dbUrl}`);
				for (let pollutant of pollutants_created.data.items){
					let obj = {
						id: pollutant.id,
						name: pollutant.name,
						type: 'float',
						min_value: 0,
						max_value: 0,
						default_value: 0,
						default_text: "",
						units: "",
						description: pollutant.description
					}
					this.item[pollutant.name] = 0
					this.vars[pollutant.name] = obj
				}

			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}

			this.page.loading = false;
		}
	}
}
</script>
