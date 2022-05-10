<template>
	<div>
		<error-alert :text="page.error"></error-alert>
		<b-toast id="changes-saved" variant="success" solid title="Changes saved" toaster="b-toaster-top-center">
			Your changes have been saved.
		</b-toast>
		
		<b-form :validated="page.validated" @submit.prevent="save">
            <b-form-group label="Parameter name">
				<b-form-input list="name-list" type="text" v-model="item.name" required autofocus />
				<b-form-datalist id="name-list" :options="parmList"></b-form-datalist>
			</b-form-group>

			<b-form-group label="Type of change">
				<b-form-select v-model="item.chg_typ" :options="chgTypeOptions" required />
			</b-form-group>

            <table class="table edit">
				<thead class="thead-light">
					<tr>
						<th>Value</th>
                        <th>Description</th>
						<th>SWAT+ Variable</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><b-form-input v-model.number="item.neg" type="number" step="any" required /></td>
						<td>Negative limit of change</td>
						<td class="code">neg</td>
					</tr>
					<tr>
						<td><b-form-input v-model.number="item.pos" type="number" step="any" required /></td>
						<td>Positive limit of change</td>
						<td class="code">pos</td>
					</tr>
					<tr>
						<td><b-form-input v-model.number="item.lo" type="number" step="any" required /></td>
						<td>Lower limit of parameter</td>
						<td class="code">lo</td>
					</tr>
					<tr>
						<td><b-form-input v-model.number="item.up" type="number" step="any" required /></td>
						<td>Upper limit of parameter</td>
						<td class="code">up</td>
					</tr>
				</tbody>
			</table>

			<action-bar>
				<save-button :saving="page.saving" />
				<back-button />
			</action-bar>
		</b-form>
	</div>
</template>

<script>
export default {
	name: 'ParmsForm',
	props: {
        apiUrl: {
			type: String,
			required: true
        },
        redirectRoute: {
			type: String,
			required: true
        },
		isUpdate: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			required: true
		},
        parmList: {
            type: Array,
            required: false
        }
	},
	data() {
		return {
			page: {
				error: null,
				validated: false,
                saving: false
			},
			chgTypeOptions: [
				{ value: 'absval', text: 'Change the value of the parameter (absval)' },
				{ value: 'abschg', text: 'Change the value by the specified amount (abschg)' },
				{ value: 'pctchg', text: 'Change the value by the specified percent (pctchg)' }
			]
		}
    },
	methods: {
		putDb(data) {
			if (this.isUpdate)
                return this.$http.put(this.apiUrl + '/' + this.item.id + '/' + this.projectDbUrl, data);
			else
				return this.$http.post(this.apiUrl + '/post/' + this.projectDbUrl, data);
        },
		async save() {
			this.page.error = null;
			this.page.saving = true;
            this.page.validated = true;
            var val_error = false;
            var item = this.item;
            
            if (!val_error) {
                try {
                    const response = await this.putDb(item);

                    if (this.isUpdate)
                        this.$bvToast.show('changes-saved');
                    else
                        this.$router.push({ name: this.redirectRoute});
                } catch (error) {
                    this.page.error = this.logError(error, 'Unable to save changes to database.');
                }
			}
			
			this.page.saving = false;
			this.page.validated = false;
        }
	}
}
</script>