 <template>
	<project-container>
		<file-header input-file="delratio.con" docs-path="connections/delivery-ratio">
			<router-link to="/edit/dr">Delivery Ratio</router-link>
			/ Create
		</file-header>

		<delratio-form :item="item" :api-url="apiUrl"></delratio-form>
	</project-container>
</template>

<script>
import DelratioForm from './DelratioForm.vue';

export default {
	name: 'DelratioCreate',
	components: {
		DelratioForm
	},
	data() {
		return {
			apiUrl: 'dr',
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