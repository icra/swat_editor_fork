 <template>
	<project-container>
		<file-header input-file="recall.con" docs-path="connections/recall">
			<router-link to="/edit/recall">Point Source</router-link>
			/ Create
		</file-header>

		<recall-form :item="item" :api-url="apiUrl"></recall-form>
	</project-container>
</template>

<script>
import RecallForm from './RecallForm.vue';

export default {
	name: 'RecallCreate',
	components: {
		RecallForm
	},
	data() {
		return {
			apiUrl: 'recall',
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
			}
		}
	}
}
</script> 