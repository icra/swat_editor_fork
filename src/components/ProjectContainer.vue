<template>
	<div>
		<page-loading :loading="loading"></page-loading>
		<div v-if="!loading">
			<div v-if="!isNullOrEmpty(loadError)">
				<div v-if="addErrorFrame">
					<div id="main-panel" class="no-sub">
						<section id="main">
							<error-alert :text="loadError"></error-alert>
						</section>
					</div>
				</div>
				<div v-else>
					<error-alert :text="loadError"></error-alert>
				</div>
			</div>
			<div v-else-if="hasCurrentProject && currentProjectSupported">
				<slot></slot>
			</div>
			<div v-else-if="addErrorFrame">
				<div id="main-panel" class="no-sub">
					<section id="main">
						<error-alert :text="errorMessage"></error-alert>
					</section>
				</div>
			</div>
			<div v-else>
				<error-alert :text="errorMessage"></error-alert>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ProjectContainer',
		props: {
			loading: {
				type: Boolean,
				default: false
			},
			addErrorFrame: {
				type: Boolean,
				default: false
			},
			loadError: {
				type: String,
				default: null
			}
		},
		data() {
			return {
				errorMessage: 'No project open. Please go to project setup to continue.'
			}
		}
	}
</script>
