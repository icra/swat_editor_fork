<template>
	<div>
	<div style="height:50px"></div>
	<div :class="fullWidth ? 'action-bar full py-2' : 'action-bar py-2'">
		<div class="d-flex align-items-center" style="padding-left:2rem;padding-right:2rem; height: 100%">
			<slot></slot>
		</div>
	</div>
	</div>
</template>

<script>
export default {
	name: 'ActionBar',
	props: {
		fullWidth: {
			type: Boolean,
			default: false
		}
	}
}
</script>
