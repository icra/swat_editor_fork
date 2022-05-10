<template>
	<div v-if="loading" class="text-center p-5">
		<font-awesome-icon :icon="['fas', 'spinner']" spin size="2x" />
	</div>
</template>

<script>
export default {
	name: 'PageLoading',
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	}
}
</script>
