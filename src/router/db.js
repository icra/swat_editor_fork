import Plants from '@/views/edit/db/Plants';
import PlantsEdit from '@/views/edit/db/PlantsEdit';
import PlantsCreate from '@/views/edit/db/PlantsCreate';

import Fertilizer from '@/views/edit/db/Fertilizer';
import FertilizerEdit from '@/views/edit/db/FertilizerEdit';
import FertilizerCreate from '@/views/edit/db/FertilizerCreate';

import Pesticides from '@/views/edit/db/Pesticides';
import PesticidesEdit from '@/views/edit/db/PesticidesEdit';
import PesticidesCreate from '@/views/edit/db/PesticidesCreate';

import Pathogens from '@/views/edit/db/Pathogens';
import PathogensEdit from '@/views/edit/db/PathogensEdit';
import PathogensCreate from '@/views/edit/db/PathogensCreate';

//ICRA Adrià Riu -- Pollutants db view
import Pollutants from '@/views/edit/db/Pollutants';
import PollutantsEdit from '@/views/edit/db/PollutantsEdit';
import PollutantsCreate from '@/views/edit/db/PollutantsCreate';


import Septic from '@/views/edit/db/Septic';
import SepticEdit from '@/views/edit/db/SepticEdit';
import SepticCreate from '@/views/edit/db/SepticCreate';

import Snow from '@/views/edit/db/Snow';
import SnowEdit from '@/views/edit/db/SnowEdit';
import SnowCreate from '@/views/edit/db/SnowCreate';

import Tillage from '@/views/edit/db/Tillage';
import TillageEdit from '@/views/edit/db/TillageEdit';
import TillageCreate from '@/views/edit/db/TillageCreate';

import Urban from '@/views/edit/db/Urban';
import UrbanEdit from '@/views/edit/db/UrbanEdit';
import UrbanCreate from '@/views/edit/db/UrbanCreate';

export default [
	{
		path: 'db/plants', name: 'Plants', component: Plants,
		children: [
			{ path: 'edit/:id', name: 'PlantsEdit', component: PlantsEdit },
			{ path: 'create', name: 'PlantsCreate', component: PlantsCreate }
		]
	},
	{
		path: 'db/fertilizer', name: 'Fertilizer', component: Fertilizer,
		children: [
			{ path: 'edit/:id', name: 'FertilizerEdit', component: FertilizerEdit },
			{ path: 'create', name: 'FertilizerCreate', component: FertilizerCreate }
		]
	},

	{
		path: 'db/pesticides', name: 'Pesticides', component: Pesticides ,
		children: [
			{ path: 'edit/:id', name: 'PesticidesEdit', component: PesticidesEdit },
			{ path: 'create', name: 'PesticidesCreate', component: PesticidesCreate }
		]
	},

	{
		path: 'db/pathogens', name: 'Pathogens', component: Pathogens ,
		children: [
			{ path: 'edit/:id', name: 'PathogensEdit', component: PathogensEdit },
			{ path: 'create', name: 'PathogensCreate', component: PathogensCreate }
		]
	},

	//ICRA Adrià Riu -- Pollutants db view
	{
		path: 'db/pollutants', name: 'Pollutants', component: Pollutants ,
		children: [
			{ path: 'edit/:id', name: 'PollutantsEdit', component: PollutantsEdit },
			{ path: 'create', name: 'PollutantsCreate', component: PollutantsCreate }
		]
	},

	{
		path: 'db/septic', name: 'Septic', component: Septic ,
		children: [
			{ path: 'edit/:id', name: 'SepticEdit', component: SepticEdit },
			{ path: 'create', name: 'SepticCreate', component: SepticCreate }
		]
	},
	{
		path: 'db/snow', name: 'Snow', component: Snow,
		children: [
			{ path: 'edit/:id', name: 'SnowEdit', component: SnowEdit },
			{ path: 'create', name: 'SnowCreate', component: SnowCreate }
		]
	},
	{
		path: 'db/tillage', name: 'Tillage', component: Tillage,
		children: [
			{ path: 'edit/:id', name: 'TillageEdit', component: TillageEdit },
			{ path: 'create', name: 'TillageCreate', component: TillageCreate }
		]
	},
	{
		path: 'db/urban', name: 'Urban', component: Urban,
		children: [
			{ path: 'edit/:id', name: 'UrbanEdit', component: UrbanEdit },
			{ path: 'create', name: 'UrbanCreate', component: UrbanCreate }
		]
	}
];
