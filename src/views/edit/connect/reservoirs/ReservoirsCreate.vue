 <template>
	<project-container>
		<file-header input-file="reservoir.con" docs-path="connections/reservoirs">
			<router-link to="/edit/reservoirs">Reservoirs</router-link>
			/ Create
		</file-header>

		<reservoirs-form :item="item" :api-url="apiUrl"></reservoirs-form>
	</project-container>
</template>

<script>
import ReservoirsForm from './ReservoirsForm.vue';

export default {
	name: 'ReservoirsCreate',
	components: {
		ReservoirsForm
	},
	data() {
		return {
			apiUrl: 'reservoirs',
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