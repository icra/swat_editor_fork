import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
		currentProject: {
			projectDb: null,
			datasetsDb: null,
			name: null,
			description: null,
			version: null,
			isLte: false
		}
    },
	mutations: {
		setCurrentProject (state, project) {
			state.currentProject = project;
		}
    },
	getters: {
		currentProject: state => state.currentProject
	}
})
