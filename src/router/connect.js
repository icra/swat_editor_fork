import Channels from '@/views/edit/connect/channels/Channels';
import ChannelsEdit from '@/views/edit/connect/channels/ChannelsEdit';
import ChannelsCreate from '@/views/edit/connect/channels/ChannelsCreate';

import ChannelsInitial from '@/views/edit/connect/channels/Initial';
import ChannelsInitialEdit from '@/views/edit/connect/channels/InitialEdit';
import ChannelsInitialCreate from '@/views/edit/connect/channels/InitialCreate';

import ChannelsNutrients from '@/views/edit/connect/channels/Nutrients';
import ChannelsNutrientsEdit from '@/views/edit/connect/channels/NutrientsEdit';
import ChannelsNutrientsCreate from '@/views/edit/connect/channels/NutrientsCreate';

import ChannelsHydSedLte from '@/views/edit/connect/channels/HydSedLte';
import ChannelsHydSedLteEdit from '@/views/edit/connect/channels/HydSedLteEdit';
import ChannelsHydSedLteCreate from '@/views/edit/connect/channels/HydSedLteCreate';

import HrusLte from '@/views/edit/connect/hrus-lte/HrusLte';
import HrusLteEdit from '@/views/edit/connect/hrus-lte/HrusLteEdit';
import HrusLteCreate from '@/views/edit/connect/hrus-lte/HrusLteCreate'; 

import Hrus from '@/views/edit/connect/hrus/Hrus';
import HrusEdit from '@/views/edit/connect/hrus/HrusEdit';
import HrusCreate from '@/views/edit/connect/hrus/HrusCreate'; 

import RoutingUnit from '@/views/edit/connect/routingunits/RoutingUnit';
import RoutingUnitEdit from '@/views/edit/connect/routingunits/RoutingUnitEdit';
import RoutingUnitCreate from '@/views/edit/connect/routingunits/RoutingUnitCreate';

import RoutingUnitElements from '@/views/edit/connect/routingunits/Elements';
import RoutingUnitElementsEdit from '@/views/edit/connect/routingunits/ElementsEdit';
import RoutingUnitElementsCreate from '@/views/edit/connect/routingunits/ElementsCreate';

import Aquifers from '@/views/edit/connect/aquifers/Aquifers';
import AquifersEdit from '@/views/edit/connect/aquifers/AquifersEdit';
import AquifersCreate from '@/views/edit/connect/aquifers/AquifersCreate';

import AquifersInitial from '@/views/edit/connect/aquifers/Initial';
import AquifersInitialEdit from '@/views/edit/connect/aquifers/InitialEdit';
import AquifersInitialCreate from '@/views/edit/connect/aquifers/InitialCreate';

import Reservoirs from '@/views/edit/connect/reservoirs/Reservoirs';
import ReservoirsEdit from '@/views/edit/connect/reservoirs/ReservoirsEdit';
import ReservoirsCreate from '@/views/edit/connect/reservoirs/ReservoirsCreate';

import ReservoirsInitial from '@/views/edit/connect/reservoirs/Initial';
import ReservoirsInitialEdit from '@/views/edit/connect/reservoirs/InitialEdit';
import ReservoirsInitialCreate from '@/views/edit/connect/reservoirs/InitialCreate';

import ReservoirsHydrology from '@/views/edit/connect/reservoirs/Hydrology';
import ReservoirsHydrologyEdit from '@/views/edit/connect/reservoirs/HydrologyEdit';
import ReservoirsHydrologyCreate from '@/views/edit/connect/reservoirs/HydrologyCreate';

import ReservoirsSediment from '@/views/edit/connect/reservoirs/Sediment';
import ReservoirsSedimentEdit from '@/views/edit/connect/reservoirs/SedimentEdit';
import ReservoirsSedimentCreate from '@/views/edit/connect/reservoirs/SedimentCreate';

import ReservoirsNutrients from '@/views/edit/connect/reservoirs/Nutrients';
import ReservoirsNutrientsEdit from '@/views/edit/connect/reservoirs/NutrientsEdit';
import ReservoirsNutrientsCreate from '@/views/edit/connect/reservoirs/NutrientsCreate';

import ReservoirsWetlands from '@/views/edit/connect/reservoirs/Wetlands';
import ReservoirsWetlandsEdit from '@/views/edit/connect/reservoirs/WetlandsEdit';
import ReservoirsWetlandsCreate from '@/views/edit/connect/reservoirs/WetlandsCreate';

import ReservoirsWetlandsHydrology from '@/views/edit/connect/reservoirs/WetlandsHydrology';
import ReservoirsWetlandsHydrologyEdit from '@/views/edit/connect/reservoirs/WetlandsHydrologyEdit';
import ReservoirsWetlandsHydrologyCreate from '@/views/edit/connect/reservoirs/WetlandsHydrologyCreate';

import Recall from '@/views/edit/connect/recall/Recall';
import RecallEdit from '@/views/edit/connect/recall/RecallEdit';
import RecallCreate from '@/views/edit/connect/recall/RecallCreate';
import RecallDataEdit from '@/views/edit/connect/recall/DataEdit';
import RecallDataCreate from '@/views/edit/connect/recall/DataCreate';

import Exco from '@/views/edit/connect/exco/Exco';
import ExcoEdit from '@/views/edit/connect/exco/ExcoEdit';
import ExcoCreate from '@/views/edit/connect/exco/ExcoCreate';

import ExcoOM from '@/views/edit/connect/exco/OM';
import ExcoOMEdit from '@/views/edit/connect/exco/OMEdit';
import ExcoOMCreate from '@/views/edit/connect/exco/OMCreate';

import Delratio from '@/views/edit/connect/dr/Delratio';
import DelratioEdit from '@/views/edit/connect/dr/DelratioEdit';
import DelratioCreate from '@/views/edit/connect/dr/DelratioCreate';

import DelratioOM from '@/views/edit/connect/dr/OM';
import DelratioOMEdit from '@/views/edit/connect/dr/OMEdit';
import DelratioOMCreate from '@/views/edit/connect/dr/OMCreate';

export default [
	{ 
		path: 'channels', name: 'Channels', component: Channels,
		children: [
			{ path: 'edit/:id', name: 'ChannelsEdit', component: ChannelsEdit },
			{ path: 'create', name: 'ChannelsCreate', component: ChannelsCreate },
			{ 
				path: 'initial', name: 'ChannelsInitial', component: ChannelsInitial,
				children: [
					{ path: 'edit/:id', name: 'ChannelsInitialEdit', component: ChannelsInitialEdit },
					{ path: 'create', name: 'ChannelsInitialCreate', component: ChannelsInitialCreate }
				] 
			},
			{ 
				path: 'nutrients', name: 'ChannelsNutrients', component: ChannelsNutrients,
				children: [
					{ path: 'edit/:id', name: 'ChannelsNutrientsEdit', component: ChannelsNutrientsEdit },
					{ path: 'create', name: 'ChannelsNutrientsCreate', component: ChannelsNutrientsCreate }
				] 
			},
			{ 
				path: 'hydsed', name: 'ChannelsHydSedLte', component: ChannelsHydSedLte,
				children: [
					{ path: 'edit/:id', name: 'ChannelsHydSedLteEdit', component: ChannelsHydSedLteEdit },
					{ path: 'create', name: 'ChannelsHydSedLteCreate', component: ChannelsHydSedLteCreate }
				] 
			}
		]
	},
	{ 
		path: 'hrus', name: 'Hrus', component: Hrus, 
			children: [
				{ path: 'edit/:id', name: 'HrusEdit', component: HrusEdit },
				{ path: 'create', name: 'HrusCreate', component: HrusCreate }
			] 	 			
	},
	{ 
		path: 'hrus-lte', name: 'HrusLte', component: HrusLte, 
			children: [
				{ path: 'edit/:id', name: 'HrusLteEdit', component: HrusLteEdit },
				{ path: 'create', name: 'HrusLteCreate', component: HrusLteCreate }
			] 	 			
	},
	{ 
		path: 'routing_unit', name: 'RoutingUnit', component: RoutingUnit, 		
			children: [
				{ path: 'edit/:id', name: 'RoutingUnitEdit', component: RoutingUnitEdit },
				{ path: 'create', name: 'RoutingUnitCreate', component: RoutingUnitCreate },
				{ 
					path: 'elements', name: 'RoutingUnitElements', component: RoutingUnitElements,
					children: [
						{ path: 'edit/:id', name: 'RoutingUnitElementsEdit', component: RoutingUnitElementsEdit },
						{ path: 'create', name: 'RoutingUnitElementsCreate', component: RoutingUnitElementsCreate }
					]
				}, 
			] 	  	
	},
	{ 
		path: 'aquifers', name: 'Aquifers', component: Aquifers, 
			children: [
				{ path: 'edit/:id', name: 'AquifersEdit', component: AquifersEdit },
				{ path: 'create', name: 'AquifersCreate', component: AquifersCreate },
				{ 
					path: 'initial', name: 'AquifersInitial', component: AquifersInitial,
					children: [
						{ path: 'edit/:id', name: 'AquifersInitialEdit', component: AquifersInitialEdit },
						{ path: 'create', name: 'AquifersInitialCreate', component: AquifersInitialCreate }
					] 
				},		
			] 					
	},
	{ 
		path: 'reservoirs', name: 'Reservoirs', component: Reservoirs, 
		children: [
			{ path: 'edit/:id', name: 'ReservoirsEdit', component: ReservoirsEdit },
			{ path: 'create', name: 'ReservoirsCreate', component: ReservoirsCreate },
			{ 
				path: 'initial', name: 'ReservoirsInitial', component: ReservoirsInitial,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsInitialEdit', component: ReservoirsInitialEdit },
					{ path: 'create', name: 'ReservoirsInitialCreate', component: ReservoirsInitialCreate }
				] 
			},
			{ 
				path: 'hydrology', name: 'ReservoirsHydrology', component: ReservoirsHydrology,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsHydrologyEdit', component: ReservoirsHydrologyEdit },
					{ path: 'create', name: 'ReservoirsHydrologyCreate', component: ReservoirsHydrologyCreate }
				]  
			},
			{ 
				path: 'sediment', name: 'ReservoirsSediment', component: ReservoirsSediment,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsSedimentEdit', component: ReservoirsSedimentEdit },
					{ path: 'create', name: 'ReservoirsSedimentCreate', component: ReservoirsSedimentCreate }
				] 
			},
			{ 
				path: 'nutrients', name: 'ReservoirsNutrients', component: ReservoirsNutrients,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsNutrientsEdit', component: ReservoirsNutrientsEdit },
					{ path: 'create', name: 'ReservoirsNutrientsCreate', component: ReservoirsNutrientsCreate }
				] 
			},
			{ 
				path: 'wetlands', name: 'ReservoirsWetlands', component: ReservoirsWetlands,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsWetlandsEdit', component: ReservoirsWetlandsEdit },
					{ path: 'create', name: 'ReservoirsWetlandsCreate', component: ReservoirsWetlandsCreate }
				] 
			},
			{ 
				path: 'wetlands_hydrology', name: 'ReservoirsWetlandsHydrology', component: ReservoirsWetlandsHydrology,
				children: [
					{ path: 'edit/:id', name: 'ReservoirsWetlandsHydrologyEdit', component: ReservoirsWetlandsHydrologyEdit },
					{ path: 'create', name: 'ReservoirsWetlandsHydrologyCreate', component: ReservoirsWetlandsHydrologyCreate }
				] 
			},
		] 					
	},
	{ 
		path: 'recall', name: 'Recall', component: Recall, 
		children: [
			{ 
				path: 'edit/:id', name: 'RecallEdit', component: RecallEdit,
				children: [
					{ path: 'edit/:dataId', name: 'RecallDataEdit', component: RecallDataEdit },
					{ path: 'create', name: 'RecallDataCreate', component: RecallDataCreate }
				]
			},
			{ path: 'create', name: 'RecallCreate', component: RecallCreate }
		] 					
	},
	{ 
		path: 'exco', name: 'Exco', component: Exco,
		children: [
			{ path: 'edit/:id', name: 'ExcoEdit', component: ExcoEdit },
			{ path: 'create', name: 'ExcoCreate', component: ExcoCreate },
			{ 
				path: 'om', name: 'ExcoOM', component: ExcoOM,
				children: [
					{ path: 'edit/:id', name: 'ExcoOMEdit', component: ExcoOMEdit },
					{ path: 'create', name: 'ExcoOMCreate', component: ExcoOMCreate }
				]
			},	
		] 		
	},
	
	{ 
		path: 'dr', name: 'Delratio', component: Delratio,
		children: [
			{ path: 'edit/:id', name: 'DelratioEdit', component: DelratioEdit },
			{ path: 'create', name: 'DelratioCreate', component: DelratioCreate },
			{ 
				path: 'om', name: 'DelratioOM', component: DelratioOM,
				children: [
					{ path: 'edit/:id', name: 'DelratioOMEdit', component: DelratioOMEdit },
					{ path: 'create', name: 'DelratioOMCreate', component: DelratioOMCreate }
				]
			},	
		] 		
	}
];