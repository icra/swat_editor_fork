 <template>
	<project-container>
		<file-header input-file="exco.con" docs-path="connections/export-coefficients">
			<router-link to="/edit/exco">Export Coefficients</router-link>
			/ Create
		</file-header>

		<exco-form :item="item" :api-url="apiUrl"></exco-form>
	</project-container>
</template>

<script>
import ExcoForm from './ExcoForm.vue';

export default {
	name: 'ExcoCreate',
	components: {
		ExcoForm
	},
	data() {
		return {
			apiUrl: 'exco',
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