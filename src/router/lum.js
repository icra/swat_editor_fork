import Landuse from '@/views/edit/lum/Landuse';
import LanduseEdit from '@/views/edit/lum/LanduseEdit';
import LanduseCreate from '@/views/edit/lum/LanduseCreate';

import Management from '@/views/edit/lum/Management';
import ManagementEdit from '@/views/edit/lum/ManagementEdit';
import ManagementCreate from '@/views/edit/lum/ManagementCreate';

import Cntable from '@/views/edit/lum/Cntable';
import CntableEdit from '@/views/edit/lum/CntableEdit';
import CntableCreate from '@/views/edit/lum/CntableCreate';

import Ovntable from '@/views/edit/lum/Ovntable';
import OvntableEdit from '@/views/edit/lum/OvntableEdit';
import OvntableCreate from '@/views/edit/lum/OvntableCreate';

import ConsPractice from '@/views/edit/lum/ConsPractice';
import ConsPracticeEdit from '@/views/edit/lum/ConsPracticeEdit';
import ConsPracticeCreate from '@/views/edit/lum/ConsPracticeCreate';

import Operations from '@/views/edit/lum/ops/Operations';

import OperationsChemApp from '@/views/edit/lum/ops/ChemApp';
import OperationsChemAppEdit from '@/views/edit/lum/ops/ChemAppEdit';
import OperationsChemAppCreate from '@/views/edit/lum/ops/ChemAppCreate';

import OperationsFire from '@/views/edit/lum/ops/Fire';
import OperationsFireEdit from '@/views/edit/lum/ops/FireEdit';
import OperationsFireCreate from '@/views/edit/lum/ops/FireCreate';

import OperationsGraze from '@/views/edit/lum/ops/Graze';
import OperationsGrazeEdit from '@/views/edit/lum/ops/GrazeEdit';
import OperationsGrazeCreate from '@/views/edit/lum/ops/GrazeCreate';

import OperationsHarvest from '@/views/edit/lum/ops/Harvest';
import OperationsHarvestEdit from '@/views/edit/lum/ops/HarvestEdit';
import OperationsHarvestCreate from '@/views/edit/lum/ops/HarvestCreate';

import OperationsIrrigation from '@/views/edit/lum/ops/Irrigation';
import OperationsIrrigationEdit from '@/views/edit/lum/ops/IrrigationEdit';
import OperationsIrrigationCreate from '@/views/edit/lum/ops/IrrigationCreate';

import OperationsSweep from '@/views/edit/lum/ops/Sweep';
import OperationsSweepEdit from '@/views/edit/lum/ops/SweepEdit';
import OperationsSweepCreate from '@/views/edit/lum/ops/SweepCreate';

export default [
	{ 
		path: 'lum/landuse', name: 'Landuse', component: Landuse,
		children: [
			{ path: 'edit/:id', name: 'LanduseEdit', component: LanduseEdit },
			{ path: 'create', name: 'LanduseCreate', component: LanduseCreate }
		]  
	},
	{ 
		path: 'lum/mgt', name: 'Management', component: Management,
		children: [
			{ path: 'edit/:id', name: 'ManagementEdit', component: ManagementEdit },
			{ path: 'create', name: 'ManagementCreate', component: ManagementCreate }
		]
	},
	{ 
		path: 'lum/ops', name: 'Operations', component: Operations,
		children: [
			{ path: 'chemapp', name: 'OperationsChemApp', component: OperationsChemApp,
				children: [
					{ path: 'edit/:id', name: 'OperationsChemAppEdit', component: OperationsChemAppEdit },
					{ path: 'create', name: 'OperationsChemAppCreate', component: OperationsChemAppCreate }
				] 
			},
			{ path: 'fire', name: 'OperationsFire', component: OperationsFire,
				children: [
					{ path: 'edit/:id', name: 'OperationsFireEdit', component: OperationsFireEdit },
					{ path: 'create', name: 'OperationsFireCreate', component: OperationsFireCreate }
				] 
			},
			{ 
				path: 'graze', name: 'OperationsGraze', component: OperationsGraze,
				children: [
					{ path: 'edit/:id', name: 'OperationsGrazeEdit', component: OperationsGrazeEdit },
					{ path: 'create', name: 'OperationsGrazeCreate', component: OperationsGrazeCreate }
				] 
			},
			{ path: 'harvest', name: 'OperationsHarvest', component: OperationsHarvest,
				children: [
					{ path: 'edit/:id', name: 'OperationsHarvestEdit', component: OperationsHarvestEdit },
					{ path: 'create', name: 'OperationsHarvestCreate', component: OperationsHarvestCreate }
				] 
			},
			{ path: 'irrigation', name: 'OperationsIrrigation', component: OperationsIrrigation,
				children: [
					{ path: 'edit/:id', name: 'OperationsIrrigationEdit', component: OperationsIrrigationEdit },
					{ path: 'create', name: 'OperationsIrrigationCreate', component: OperationsIrrigationCreate }
				] 
			},
			{ path: 'sweep', name: 'OperationsSweep', component: OperationsSweep,
				children: [
					{ path: 'edit/:id', name: 'OperationsSweepEdit', component: OperationsSweepEdit },
					{ path: 'create', name: 'OperationsSweepCreate', component: OperationsSweepCreate }
				] 
			}
		]
	},
	{ 
		path: 'lum/cntable', name: 'Cntable', component: Cntable,
		children: [
			{ path: 'edit/:id', name: 'CntableEdit', component: CntableEdit },
			{ path: 'create', name: 'CntableCreate', component: CntableCreate }
		]   
	},
	{ 
		path: 'lum/ovntable', name: 'Ovntable', component: Ovntable,
		children: [
			{ path: 'edit/:id', name: 'OvntableEdit', component: OvntableEdit },
			{ path: 'create', name: 'OvntableCreate', component: OvntableCreate }
		] 
	},
	{ 
		path: 'lum/conspractice', name: 'ConsPractice', component: ConsPractice,
		children: [
			{ path: 'edit/:id', name: 'ConsPracticeEdit', component: ConsPracticeEdit },
			{ path: 'create', name: 'ConsPracticeCreate', component: ConsPracticeCreate }
		] 
	}
];