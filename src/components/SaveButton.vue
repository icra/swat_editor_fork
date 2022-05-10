<template>
	<b-button :type="type" :variant="variant" :disabled="saving" class="mr-1">
		<font-awesome-icon v-if="saving" :icon="['fas', 'spinner']" spin />
		{{ text }}
	</b-button>
</template>

<script>
export default {
	name: 'SaveButton',
	props: {
		saving: {
			type: Boolean,
			default: false
		},
		text: {
			type: String,
			default: 'Save Changes'
		},
		type: {
			type: String,
			default: 'submit'
		},
		variant: {
			type: String,
			default: 'primary'
		}
	}
}
</script>