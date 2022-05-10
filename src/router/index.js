import Vue from 'vue';
import Router from 'vue-router';

import Setup from '@/views/Setup';
import Help from '@/views/Help';
import Run from '@/views/Run';
import Check from '@/views/Check';
import Edit from '@/views/edit/Edit';
import TableBrowser from '@/views/TableBrowser';

import basin from './basin';
import change from './change';
import climate from './climate';
import connect from './connect';
import decision_table from './decision_table';
import db from './db';
import hydrology from './hydrology';
import init from './init';
import lum from './lum';
import regions from './regions';
import soils from './soils';
import structural from './structural';
/*import simulation from './simulation';*/

Vue.use(Router);

const editRoutes = climate.concat(basin, change, connect, decision_table, db, hydrology, init, lum, regions, soils, structural);//, simulation);

export default new Router({
	linkActiveClass: "active",
	routes: [
		{ path: '/setup', name: 'Setup', component: Setup },
		{ path: '/help', name: 'Help', component: Help },
		{ path: '/run', name: 'Run', component: Run },
		{ path: '/check', name: 'Check', component: Check },
		{ 
			path: '/edit', name: 'Edit', component: Edit,
			children: editRoutes
		},
		{ path: '/table-browser', name: 'TableBrowser', component: TableBrowser },
		{
			path: '*',
			redirect: '/setup'
		}
	]
});
