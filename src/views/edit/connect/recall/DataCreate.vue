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
			api-url="recall/data/item"
			:redirect-route="`/edit/recall/edit/${$route.params.id}`" redirect-path />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'RecallDataCreate',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				vars: 'recall_dat'
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
			}
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
                this.vars = response.data;
                this.item = this.setVars(this.item, this.vars);
				this.item.recall_rec_id = this.$route.params.id;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get table metadata from database.');
			}
				
			this.page.loading = false;
		}
	}
}
</script>