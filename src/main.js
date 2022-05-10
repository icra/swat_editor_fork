import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

import './plugins/bootstrap-vue';
import './plugins/font-awesome';
import './plugins/custom-components';
import './plugins/filters';
import './plugins/global-mixin';
import './plugins/highcharts';
//import './plugins/titlebar';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const remote = window.require('electron').remote;
const port = remote.getGlobal('api_port');

Vue.prototype.$http = axios.create({ baseURL: 'http://localhost:' + port + '/' });

Vue.config.productionTip = false

new Vue({
	router,
    store,
    render: h => h(App),
}).$mount('#app')
