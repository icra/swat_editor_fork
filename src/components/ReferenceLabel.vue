<template>
	<div class="sm-pop">
		This field references a row in the <mark>{{ section }}</mark> section.
		<hr class="my-1">
		<div>Input file: <b class="code">{{ file }}</b></div>
		<div>Database table: <b class="code">{{ db }}</b></div>
		<div v-if="!isNullOrEmpty(apiUrl)" class="mt-2">
			<router-link :to="`/table-browser?apiUrl=${apiUrl}&section=${section}&projectDb=${projectDbUrl}`" target="_blank" class="btn btn-sm btn-primary">Browse table</router-link>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ReferenceLabel',
	props: {
		section: {
			type: String,
			required: true
		},
		file: {
			type: String,
			required: true
		},
		db: {
			type: String,
			required: true
		},
		apiUrl: {
			type: String,
			required: false
		}
    }
}
</script>