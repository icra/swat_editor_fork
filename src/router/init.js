import InitPlant from '@/views/edit/init/Plant';
import InitPlantEdit from '@/views/edit/init/PlantEdit';
import InitPlantCreate from '@/views/edit/init/PlantCreate';

import InitSoilPlant from '@/views/edit/init/SoilPlant';
import InitSoilPlantEdit from '@/views/edit/init/SoilPlantEdit';
import InitSoilPlantCreate from '@/views/edit/init/SoilPlantCreate';

import InitOMWater from '@/views/edit/init/OMWater';
import InitOMWaterEdit from '@/views/edit/init/OMWaterEdit';
import InitOMWaterCreate from '@/views/edit/init/OMWaterCreate';

import InitConstituents from '@/views/edit/init/constituents/Constituents';
import InitConstituentsPestHruIni from '@/views/edit/init/constituents/PestHruIni';
import InitConstituentsPestWaterIni from '@/views/edit/init/constituents/PestWaterIni';
import InitConstituentsPathHruIni from '@/views/edit/init/constituents/PathHruIni';
import InitConstituentsPathWaterIni from '@/views/edit/init/constituents/PathWaterIni';

export default [
	{ 
		path: 'init/plant', name: 'InitPlant', component: InitPlant, 
		children: [
			{ path: 'edit/:id', name: 'InitPlantEdit', component: InitPlantEdit },
			{ path: 'create', name: 'InitPlantCreate', component: InitPlantCreate }
		] 
	},
	{ 
		path: 'init/soil_plant', name: 'InitSoilPlant', component: InitSoilPlant, 
		children: [
			{ path: 'edit/:id', name: 'InitSoilPlantEdit', component: InitSoilPlantEdit },
			{ path: 'create', name: 'InitSoilPlantCreate', component: InitSoilPlantCreate }
		]
	},
	{ 
		path: 'init/om_water', name: 'InitOMWater', component: InitOMWater, 
		children: [
			{ path: 'edit/:id', name: 'InitOMWaterEdit', component: InitOMWaterEdit },
			{ path: 'create', name: 'InitOMWaterCreate', component: InitOMWaterCreate }
		] 
	},
	{ 
		path: 'init/constituents', name: 'InitConstituents', component: InitConstituents, 
		children: [
			{ path: 'pest-hru', name: 'InitConstituentsPestHruIni', component: InitConstituentsPestHruIni },
			{ path: 'pest-water', name: 'InitConstituentsPestWaterIni', component: InitConstituentsPestWaterIni },
			{ path: 'path-hru', name: 'InitConstituentsPathHruIni', component: InitConstituentsPathHruIni },
			{ path: 'path-water', name: 'InitConstituentsPathWaterIni', component: InitConstituentsPathWaterIni }
		] 
	},
];