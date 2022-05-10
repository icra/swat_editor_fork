import LandscapeUnits from '@/views/edit/regions/ls_units/LandscapeUnits';
import LandscapeUnitsEdit from '@/views/edit/regions/ls_units/LandscapeUnitsEdit';
import LandscapeUnitsCreate from '@/views/edit/regions/ls_units/LandscapeUnitsCreate';

import LandscapeUnitsElements from '@/views/edit/regions/ls_units/Elements';
import LandscapeUnitsElementsEdit from '@/views/edit/regions/ls_units/ElementsEdit';
import LandscapeUnitsElementsCreate from '@/views/edit/regions/ls_units/ElementsCreate';

export default [
	{ 
		path: 'regions/ls_units', name: 'LandscapeUnits', component: LandscapeUnits,
		children: [
			{ path: 'edit/:id', name: 'LandscapeUnitsEdit', component: LandscapeUnitsEdit },
			{ path: 'create', name: 'LandscapeUnitsCreate', component: LandscapeUnitsCreate },
			{ 
				path: 'elements', name: 'LandscapeUnitsElements', component: LandscapeUnitsElements,
				children: [
					{ path: 'edit/:id', name: 'LandscapeUnitsElementsEdit', component: LandscapeUnitsElementsEdit },
					{ path: 'create', name: 'LandscapeUnitsElementsCreate', component: LandscapeUnitsElementsCreate }
				]  
			}
		] 
	}
];