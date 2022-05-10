<template>
	<project-container>
		<file-header input-file="management.sch" docs-path="land-use-management#management-schedules">
			<router-link to="/edit/lum/mgt">Management Schedules</router-link>
			/ Create
		</file-header>

		<management-form :item="item" />
	</project-container>
</template>

<script>
import ManagementForm from './ManagementForm';

export default {
	name: 'ManagementCreate',
	components: {
		ManagementForm
	},
	data: function() {
		return {
			item: {
				id: null,
				name: null,
				auto_ops: [],
				operations: []
			}
		}
	}
}
</script>