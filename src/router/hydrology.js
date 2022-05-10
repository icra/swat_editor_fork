import Hydrology from '@/views/edit/hydrology/Hydrology';
import HydrologyEdit from '@/views/edit/hydrology/HydrologyEdit';
import HydrologyCreate from '@/views/edit/hydrology/HydrologyCreate';

import Topography from '@/views/edit/hydrology/Topography';
import TopographyEdit from '@/views/edit/hydrology/TopographyEdit';
import TopographyCreate from '@/views/edit/hydrology/TopographyCreate';

import Fields from '@/views/edit/hydrology/Fields';
import FieldsEdit from '@/views/edit/hydrology/FieldsEdit';
import FieldsCreate from '@/views/edit/hydrology/FieldsCreate';

export default [
	{ 
		path: 'hydrology', name: 'Hydrology', component: Hydrology, 
		children: [
			{ path: 'edit/:id', name: 'HydrologyEdit', component: HydrologyEdit },
			{ path: 'create', name: 'HydrologyCreate', component: HydrologyCreate }
		]  
	},
	{ 
		path: 'topography', name: 'Topography', component: Topography, 
		children: [
			{ path: 'edit/:id', name: 'TopographyEdit', component: TopographyEdit },
			{ path: 'create', name: 'TopographyCreate', component: TopographyCreate }
		]  
	},
	{ 
		path: 'fields', name: 'Fields', component: Fields, 
		children: [
			{ path: 'edit/:id', name: 'FieldsEdit', component: FieldsEdit },
			{ path: 'create', name: 'FieldsCreate', component: FieldsCreate }
		]   
	}
];