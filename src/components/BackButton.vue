<template>
	<b-btn variant="secondary" @click="goBack">
		Back
	</b-btn>
</template>

<script>
export default {
	name: 'BackButton',
	methods: {
		goBack() {
			this.$router.go(-1);
		}
	}
}
</script>