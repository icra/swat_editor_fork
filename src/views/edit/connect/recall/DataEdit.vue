<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<file-header input-file="recall.con" docs-path="connections/recall">
			<router-link to="/edit/recall">Point Source</router-link>
			/ <router-link :to="`/edit/recall/edit/${$route.params.id}`">{{rec.name}}</router-link>
			/ Edit
		</file-header>
		
		<p>
			Record Type: {{rec.rec_typ_name}}
		</p>

		<edit-form show-range is-update hide-name
			:item="item"
			:vars="vars" 
			api-url="recall/data/item"
			:redirect-route="`/edit/recall/edit/${$route.params.id}`" redirect-path />
	</project-container>
</template>

<script>
import EditForm from '@/components/EditForm';

export default {
	name: 'RecallDataEdit',
	components: {
		EditForm
	},
	data() {
		return {
			paths: {
				data: 'recall/data/item',
				vars: 'recall_dat'
			},
			page: {
				loading: false,
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
	watch: {
		'$route': 'get'
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
				const response = await this.$http.get(`${this.paths.data}/${this.$route.params.dataId}/${this.projectDbUrl}`);
				this.item = response.data;
				this.item.recall_rec_id = this.item.recall_rec;
				this.log(this.item);

				const response2 = await this.$http.get(`vars/${this.paths.vars}/${this.appPath}`);
				this.vars = response2.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get project information from database.');
			}
			
			this.page.loading = false;
		}
	}
}
</script>