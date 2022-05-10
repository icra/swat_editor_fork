<template>
	<div>
		<error-alert :text="errorTitle"></error-alert>

		<p>
			If you do not know the cause of the error, please copy and paste the log below into the <open-in-browser url="https://groups.google.com/d/forum/swatplus-editor" text="SWAT+ Editor user group" />.
			Please include your project database and any other relevant files.
		</p>

		<b-form-textarea v-model="stackTrace" rows="3" max-rows="6" readonly class="mb-4" @focus.native="$event.target.select()"></b-form-textarea>
	</div>
</template>

<script>
import OpenInBrowser from '@/components/OpenInBrowser';

export default {
	name: 'StackTraceError',
	props: {
		errorTitle: {
			type: String,
			default: 'SWAT+ Editor has encountered an error.',
			required: false
		},
		stackTrace: {
			type: String,
			default: '',
			required: false
		}
	},
	components: {
		OpenInBrowser
	}
}
</script>