<template>
	<b-alert :variant="variant" :show="!isNullOrEmpty(text)">
		<div class="d-flex align-items-start">
			<div v-if="!hideIcon" class="mr-3">
				<font-awesome-icon :icon="['fas', icon]" :size="iconSize" :class="iconClass" />
			</div>
			<div>{{text}}</div>
		</div>		
	</b-alert>
</template>

<script>
export default {
	name: 'ErrorAlert',
	props: {
		text: {
			type: String,
			default: null
		},
		variant: {
			type: String,
			default: 'danger'
		},
		hideIcon: {
			type: Boolean,
			default: false
		},
		iconSize: {
			type: String,
			default: 'lg'
		},
		icon: {
			type: String,
			default: 'exclamation-triangle'
		},
		iconClass: {
			type: String,
			default: 'text-danger'
		}
	}
}
</script>