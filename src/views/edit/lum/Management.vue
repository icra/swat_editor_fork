<template>
	<project-container>
		<div v-if="$route.name == 'Management'">
			<file-header input-file="management.sch" docs-path="land-use-management#management-schedules">
				Management Schedules
			</file-header>

			<grid-view 
				api-url="mgt_sch"
				collection-description="management schedules"
				use-filter use-action-bar
				default-sort="name"
				:fields="fields"
				show-import-export default-csv-file="management.sch" table-name="mgt_sch" import-export-description="text">
			</grid-view>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'Management',
	data () {
		return {
			fields: [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'num_ops', label: 'Number of operations', sortable: false },
				{ key: 'num_auto', label: 'Number of auto schedules', sortable: false }
			]
		}
	}
}
</script>