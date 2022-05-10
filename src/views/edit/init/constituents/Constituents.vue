<template>
	<project-container :loading="page.loading" :load-error="page.error">
		<div v-if="$route.name == 'InitConstituents'">
			<file-header input-file="constituents.cs" docs-path="simulation">
				Constituents
			</file-header>

			<p>
				The constituents file enables pesticides and pathogens used in your model.
				Do you want to include and configure these in your model?
			</p>
			
			<error-alert :text="page.saveError"></error-alert>
			<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
				Your changes have been saved.
			</b-toast>

			<b-form @submit="submit" :validated="page.validated">
				<b-form-group>
					<b-form-radio-group
						buttons button-variant="outline-primary"
						v-model="item.using"
						:options="options" />
				</b-form-group>

				<div v-if="item.using">
					<h3>Pesticides</h3>
					<div class="mb-1">
						<b-button v-for="(p, i) in item.pests" :key="i" variant="light" class="mr-2 mb-2 border" v-b-tooltip.hover="'Click to remove from list'" @click="removePest(p)">
							{{p}}
							<font-awesome-icon :icon="['fas', 'times']" class="ml-1 text-danger" />
						</b-button>
					</div>

					<b-form-group class="mt-3">
						<template slot="label">
							Add a pesticide
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="pest_pop" />
						</template>
						<b-popover target="pest_pop" triggers="hover focus">
							<reference-label section="Databases / Pesticides" file="pesticide.pes" db="pesticide_pst" />
						</b-popover>

						<b-row no-gutters>
							<b-col md="6" lg="4">
								<type-ahead :required="false" show-preview
									v-model="add.pest"
									:value="add.pest"
									src=":keyword"
									:fetch="getNamesPest"
									:getResponse="getDataResponse" />
							</b-col>
							<b-col md="2" lg="1">
								<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(add.pest)"   @click="addPest">Add</b-btn>
							</b-col>
						</b-row>
					</b-form-group>

					<hr class="my-4" />

					<h3>Pathogens</h3>
					<div class="mb-1">
						<b-button v-for="(p, i) in item.paths" :key="i" variant="light" class="mr-2 mb-2 border" v-b-tooltip.hover="'Click to remove from list'" @click="removePath(p)">
							{{p}}
							<font-awesome-icon :icon="['fas', 'times']" class="ml-1 text-danger" />
						</b-button>
					</div>

					<b-form-group class="mt-3">
						<template slot="label">
							Add a pathogen
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="path_pop" />
						</template>
						<b-popover target="path_pop" triggers="hover focus">
							<reference-label section="Databases / Pathogens" file="pathogens.pth" db="pathogens_pth" />
						</b-popover>

						<b-row no-gutters>
							<b-col md="6" lg="4">
								<type-ahead :required="false" show-preview
									v-model="add.path"
									:value="add.path"
									src=":keyword"
									:fetch="getNamesPath"
									:getResponse="getDataResponse" />
							</b-col>
							<b-col md="2" lg="1">
								<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(add.path)"   @click="addPath">Add</b-btn>
							</b-col>
						</b-row>
					</b-form-group>

					<div v-if="false">
					<hr class="my-4" />

					<h3>Heavy Metals</h3>
					<div class="mb-1">
						<b-button v-for="(p, i) in item.hmets" :key="i" variant="light" class="mr-2 mb-2 border" v-b-tooltip.hover="'Click to remove from list'" @click="removeHmet(p)">
							{{p}}
							<font-awesome-icon :icon="['fas', 'times']" class="ml-1 text-danger" />
						</b-button>
					</div>

					<b-form-group class="mt-3">
						<template slot="label">
							Add a metal
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="hmet_pop" />
						</template>
						<b-popover target="hmet_pop" triggers="hover focus">
							<reference-label section="Databases / Metals" file="metals.mtl" db="metals_mtl" />
						</b-popover>

						<b-row no-gutters>
							<b-col md="6" lg="4">
								<type-ahead :required="false" show-preview
									v-model="add.hmet"
									:value="add.hmet"
									src=":keyword"
									:fetch="getNamesHmet"
									:getResponse="getDataResponse" />
							</b-col>
							<b-col md="2" lg="1">
								<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(add.hmet)"   @click="addHmet">Add</b-btn>
							</b-col>
						</b-row>
					</b-form-group>

					<hr class="my-4" />

					<h3>Salts</h3>
					<div class="mb-1">
						<b-button v-for="(p, i) in item.salts" :key="i" variant="light" class="mr-2 mb-2 border" v-b-tooltip.hover="'Click to remove from list'" @click="removeSalt(p)">
							{{p}}
							<font-awesome-icon :icon="['fas', 'times']" class="ml-1 text-danger" />
						</b-button>
					</div>

					<b-form-group class="mt-3">
						<template slot="label">
							Add a salt
							<font-awesome-icon :icon="['fas', 'question-circle']" class="text-info pointer" id="salt_pop" />
						</template>
						<b-popover target="salt_pop" triggers="hover focus">
							<reference-label section="Databases / Salts" file="salts.slt" db="salts_slt" />
						</b-popover>

						<b-row no-gutters>
							<b-col md="6" lg="4">
								<type-ahead :required="false" show-preview
									v-model="add.salt"
									:value="add.salt"
									src=":keyword"
									:fetch="getNamesSalt"
									:getResponse="getDataResponse" />
							</b-col>
							<b-col md="2" lg="1">
								<b-btn variant="primary" class="wide ml-1" :disabled="isNullOrEmpty(add.salt)"   @click="addSalt">Add</b-btn>
							</b-col>
						</b-row>
					</b-form-group>
					</div>
				</div>
			
				<action-bar>
					<save-button :saving="page.saving" />
                    <back-button />
				</action-bar>
			</b-form>
		</div>
		<router-view></router-view>
	</project-container>
</template>

<script>
export default {
	name: 'InitConstituents',
	data() {
		return {
			apiUrl: 'constituents/',
			page: {
				loading: false,
				error: null,
				validated: false,
				saving: false,
				saveError: null
			},
			item: {
				using: false,
				pests: [],
				paths: [],
				hmets: [],
				salts: []
			},
			options: [
				{ value: false, text: 'No, do not use' },
				{ value: true, text: 'Yes, include' }
			],
			add: {
				pest: null,
				path: null,
				hmet: null,
				salt: null
			}
		}
	},
	async created() {
		if (this.currentProjectSupported) await this.get();
	},
	methods: {
		getDb() {
			return this.$http.get(this.apiUrl + this.projectDbUrl);
		},
		putDb(data) {
			return this.$http.put(this.apiUrl + this.projectDbUrl, data);
		},
		deleteDb() {
			return this.$http.delete(this.apiUrl + this.projectDbUrl);
		},
		async get() {
			this.page.loading = true;
			this.page.error = null;

            try {
				const response = await this.getDb();
				this.log(response.data);
				this.item = response.data;
			} catch (error) {
				this.page.error = this.logError(error, 'Unable to get calibration codes from database.');
			}
			
			this.page.loading = false;
		},
		async submit() {
			if (this.item.using)
				return await this.save();
			else
				return await this.delete();
		},
		async save() {
			this.page.saveError = null;
			this.page.saving = true;
			this.page.validated = true;

			if (this.item.pests.length < 1 && this.item.paths.length < 1) {
				this.page.saveError = 'Please add at least one item below.';
			} else {
				try {
					const response = await this.putDb(this.item);
					this.$bvToast.show('changes-saved');
				} catch (error) {
					this.page.saveError = this.logError(error, 'Unable to save changes to database.');
				}
			}
			
			this.page.saving = false;
			this.page.validated = false;
		},
		async delete() {
			this.page.saveError = null;
			this.page.saving = true;

			try {
				const response = await this.deleteDb();
			} catch (error) {
				this.page.saveError = this.logError(error, 'Unable to delete from database.');
			}
			
			this.page.saving = false;
		},
		getNamesPest(name) {
			return this.getAutoComplete('pest', name);
		},
		addPest() {
			if (!this.isNullOrEmpty(this.add.pest) && !this.item.pests.includes(this.add.pest)) this.item.pests.push(this.add.pest);
			this.add.pest = null;
		},
		removePest(name) {
			this.item.pests.splice(this.item.pests.indexOf(name), 1);
		},
		getNamesPath(name) {
			return this.getAutoComplete('path', name);
		},
		addPath() {
			if (!this.isNullOrEmpty(this.add.path) && !this.item.paths.includes(this.add.path)) this.item.paths.push(this.add.path);
			this.add.path = null;
		},
		removePath(name) {
			this.item.paths.splice(this.item.paths.indexOf(name), 1);
		},
		getNamesHmet(name) {
			return this.getAutoComplete('hmet', name);
		},
		addHmet() {
			if (!this.isNullOrEmpty(this.add.hmet) && !this.item.hmets.includes(this.add.hmet)) this.item.hmets.push(this.add.hmet);
			this.add.hmet = null;
		},
		removeHmet(name) {
			this.item.hmets.splice(this.item.hmets.indexOf(name), 1);
		},
		getNamesSalt(name) {
			return this.getAutoComplete('salt', name);
		},
		addSalt() {
			if (!this.isNullOrEmpty(this.add.salt) && !this.item.salts.includes(this.add.salt)) this.item.salts.push(this.add.salt);
			this.add.salt = null;
		},
		removeSalt(name) {
			this.item.salts.splice(this.item.salts.indexOf(name), 1);
		}
	}
}
</script>