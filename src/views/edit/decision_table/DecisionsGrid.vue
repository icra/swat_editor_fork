<template>
	<div>
		<file-header :input-file="decisionsTable" docs-path="decision-tables">
			Decision Tables / {{description}}
		</file-header>

		<p>
			If you want to create a new table, please select a similar table from the list below, and use the copy function. 
			You may then edit the copy to suit your needs.
			You may also modify or add decision tables offline and import them into SWAT+ Editor using the import/export button below.
			Please export first to get your existing tables, and adhere to the formatting of the file.
		</p>

		<b-alert :show="decisionsTable==='lum.dtl' && !currentProject.isLte" variant="warning">
			This section is for advanced decision table management. 
			We recommend most users use the <router-link to="/edit/lum/mgt">management schedule builder</router-link>.
		</b-alert>
		<b-alert :show="decisionsTable==='flo_con.dtl'" variant="warning">
			We recommend not using flow condition tables at this time unless you are an advanced user who has already been in touch with the SWAT+ model development team to discuss your needs.
		</b-alert>
		<b-alert :show="decisionsTable==='scen_lu.dtl'" variant="info">
			Any land use scenarios added to your project tables below will be applied to your model. <br />Browse the datasets library tab and copy a scenario to your project as needed.
		</b-alert>		

		<b-tabs content-class="mt-3">
			<b-tab title="Project Tables">
				<div class="tab-container">
					<p>
						The following tables are available in your project. 
						Click the datasets library tab to see additional examples you can copy to your project.
					</p>

					<grid-view 
						:api-url="`decision_table/${decisionsTable}`" :default-per-page="50"
						collection-description="decision tables"
						use-filter use-action-bar
						default-sort="name"
						use-dynamic-fields hide-create hide-delete
						edit-route="/edit/decision_table/edit/project/" :edit-route-append="false"
						show-import-export :default-csv-file="decisionsTable" :table-name="decisionsTable" import-export-description="text" />
				</div>
			</b-tab>

			<b-tab title="Datasets Library">
				<div class="tab-container">
					<p>
						The following tables are available in your datasets library.
						Select a table below to view it and copy to your project if desired.
					</p>

					<grid-view 
						:api-url="`decision_table_datasets/${decisionsTable}`" use-datasets-db :default-per-page="50"
						collection-description="decision tables"
						use-filter use-action-bar
						default-sort="name"
						use-dynamic-fields hide-create hide-delete
						edit-route="/edit/decision_table/edit/datasets/" :edit-route-append="false"
						show-import-export :default-csv-file="decisionsTable" :table-name="decisionsTable" import-export-description="text" />
				</div>
			</b-tab>
		</b-tabs>

		
	</div>
</template>

<script>
export default {
	name: 'DecisionsGrid',
	props: {
		decisionsTable: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	}
}
</script>