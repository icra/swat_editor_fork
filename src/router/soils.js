import Soils from '@/views/edit/soils/Soils';
import SoilsEdit from '@/views/edit/soils/SoilsEdit';
import SoilsCreate from '@/views/edit/soils/SoilsCreate';

import SoilNutrients from '@/views/edit/soils/Nutrients';
import SoilNutrientsEdit from '@/views/edit/soils/NutrientsEdit';
import SoilNutrientsCreate from '@/views/edit/soils/NutrientsCreate';

import SoilsLte from '@/views/edit/soils/SoilsLte';
import SoilsLteEdit from '@/views/edit/soils/SoilsLteEdit';
import SoilsLteCreate from '@/views/edit/soils/SoilsLteCreate';

export default [
	{ 
		path: 'soils', name: 'Soils', component: Soils,
		children: [
			{ path: 'edit/:id', name: 'SoilsEdit', component: SoilsEdit },
			{ path: 'create', name: 'SoilsCreate', component: SoilsCreate }
		]  
	},
	{ 
		path: 'soil-nutrients', name: 'SoilNutrients', component: SoilNutrients,
		children: [
			{ path: 'edit/:id', name: 'SoilNutrientsEdit', component: SoilNutrientsEdit },
			{ path: 'create', name: 'SoilNutrientsCreate', component: SoilNutrientsCreate }
		]   
	},
	{ 
		path: 'soils-lte', name: 'SoilsLte', component: SoilsLte,
		children: [
			{ path: 'edit/:id', name: 'SoilsLteEdit', component: SoilsLteEdit },
			{ path: 'create', name: 'SoilsLteCreate', component: SoilsLteCreate }
		]   
	}
];