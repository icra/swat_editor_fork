import Wgn from '@/views/edit/climate/Wgn';
import WgnEdit from '@/views/edit/climate/WgnEdit';
import WgnCreate from '@/views/edit/climate/WgnCreate';

import Stations from '@/views/edit/climate/Stations';
import StationsEdit from '@/views/edit/climate/StationsEdit';
import StationsCreate from '@/views/edit/climate/StationsCreate';

export default [
	{ 
		path: 'wgn', name: 'Wgn', component: Wgn,
		children: [
			{ path: 'edit/:id', name: 'WgnEdit', component: WgnEdit },
			{ path: 'create', name: 'WgnCreate', component: WgnCreate }
		]
	},
	{ 
		path: 'stations', name: 'Stations', component: Stations,
		children: [
			{ path: 'edit/:id', name: 'StationsEdit', component: StationsEdit },
			{ path: 'create', name: 'StationsCreate', component: StationsCreate }
		]
	}
];