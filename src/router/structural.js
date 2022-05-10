import TiledrainStr from '@/views/edit/structural/Tiledrain';
import TiledrainStrEdit from '@/views/edit/structural/TiledrainStrEdit';
import TiledrainStrCreate from '@/views/edit/structural/TiledrainStrCreate';

import SepticStr from '@/views/edit/structural/Septic';
import SepticStrEdit from '@/views/edit/structural/SepticStrEdit';
import SepticStrCreate from '@/views/edit/structural/SepticStrCreate';

import FilterstripStr from '@/views/edit/structural/Filterstrip';
import FilterstripStrEdit from '@/views/edit/structural/FilterstripStrEdit';
import FilterstripStrCreate from '@/views/edit/structural/FilterstripStrCreate';

import GrassedwwStr from '@/views/edit/structural/Grassedww';
import GrassedwwStrEdit from '@/views/edit/structural/GrassedwwStrEdit';
import GrassedwwStrCreate from '@/views/edit/structural/GrassedwwStrCreate';

import BmpuserStr from '@/views/edit/structural/Bmpuser';
import BmpuserStrEdit from '@/views/edit/structural/BmpuserStrEdit';
import BmpuserStrCreate from '@/views/edit/structural/BmpuserStrCreate';


export default [
	{ 
		path: 'structural/tiledrain', name: 'TiledrainStr', component: TiledrainStr,
		children: [
			{ path: 'edit/:id', name: 'TiledrainStrEdit', component: TiledrainStrEdit },
			{ path: 'create', name: 'TiledrainStrCreate', component: TiledrainStrCreate }
		]
	},
	{ 
		path: 'structural/septic', name: 'SepticStr', component: SepticStr,
		children: [
			{ path: 'edit/:id', name: 'SepticStrEdit', component: SepticStrEdit },
			{ path: 'create', name: 'SepticStrCreate', component: SepticStrCreate }
		]
	},
	{ 
		path: 'structural/filterstrip', name: 'FilterstripStr', component: FilterstripStr,
		children: [
			{ path: 'edit/:id', name: 'FilterstripStrEdit', component: FilterstripStrEdit },
			{ path: 'create', name: 'FilterstripStrCreate', component: FilterstripStrCreate }
		]
	},
	{ 
		path: 'structural/grassedww', name: 'GrassedwwStr', component: GrassedwwStr,
		children: [
			{ path: 'edit/:id', name: 'GrassedwwStrEdit', component: GrassedwwStrEdit },
			{ path: 'create', name: 'GrassedwwStrCreate', component: GrassedwwStrCreate }
		]
	},
	{ 
		path: 'structural/bmpuser', name: 'BmpuserStr', component: BmpuserStr,
		children: [
			{ path: 'edit/:id', name: 'BmpuserStrEdit', component: BmpuserStrEdit },
			{ path: 'create', name: 'BmpuserStrCreate', component: BmpuserStrCreate }
		]
	},
];