import CalParms from '@/views/edit/change/hard/CalParms';
import CalParmsEdit from '@/views/edit/change/hard/CalParmsEdit';

import Calibration from '@/views/edit/change/hard/Calibration';
import CalibrationEdit from '@/views/edit/change/hard/CalibrationEdit';
import CalibrationCreate from '@/views/edit/change/hard/CalibrationCreate';

import CalCodes from '@/views/edit/change/soft/Codes';

import WbParms from '@/views/edit/change/soft/WbParms';
import WbParmsEdit from '@/views/edit/change/soft/WbParmsEdit';
import WbParmsCreate from '@/views/edit/change/soft/WbParmsCreate';

import ChsedParms from '@/views/edit/change/soft/ChsedParms';
import ChsedParmsEdit from '@/views/edit/change/soft/ChsedParmsEdit';
import ChsedParmsCreate from '@/views/edit/change/soft/ChsedParmsCreate';

import PlantParms from '@/views/edit/change/soft/PlantParms';
import PlantParmsEdit from '@/views/edit/change/soft/PlantParmsEdit';
import PlantParmsCreate from '@/views/edit/change/soft/PlantParmsCreate';

import WaterBalance from '@/views/edit/change/soft/WaterBalance';
import WaterBalanceEdit from '@/views/edit/change/soft/WaterBalanceEdit';
import WaterBalanceCreate from '@/views/edit/change/soft/WaterBalanceCreate';

import ChsedBudget from '@/views/edit/change/soft/ChsedBudget';
import ChsedBudgetEdit from '@/views/edit/change/soft/ChsedBudgetEdit';
import ChsedBudgetCreate from '@/views/edit/change/soft/ChsedBudgetCreate';

import PlantGro from '@/views/edit/change/soft/PlantGro';
import PlantGroEdit from '@/views/edit/change/soft/PlantGroEdit';
import PlantGroCreate from '@/views/edit/change/soft/PlantGroCreate';

export default [
	{ 
		path: 'change/hard', name: 'HardCalibration', component: Calibration,
		children: [
			{ path: 'edit/:id', name: 'HardCalibrationEdit', component: CalibrationEdit },
			{ path: 'create', name: 'HardCalibrationCreate', component: CalibrationCreate },
			{ 
				path: 'parms', name: 'HardCalibrationParms', component: CalParms,
				children: [
					{ path: 'edit/:id', name: 'HardCalibrationParmsEdit', component: CalParmsEdit }
				]  
			},
		]  
	},
	{ 
		path: 'change/soft', name: 'SoftCalibration', component: CalCodes,
		children: [
			{ 
				path: 'wb', name: 'SoftCalibrationWaterBalance', component: WaterBalance,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationWaterBalanceEdit', component: WaterBalanceEdit },
					{ path: 'create', name: 'SoftCalibrationWaterBalanceCreate', component: WaterBalanceCreate }
				]  
			},
			{ 
				path: 'wbparms', name: 'SoftCalibrationWbParms', component: WbParms,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationWbParmsEdit', component: WbParmsEdit },
					{ path: 'create', name: 'SoftCalibrationWbParmsCreate', component: WbParmsCreate }
				]  
			},
			{ 
				path: 'chsed', name: 'SoftCalibrationChsedBudget', component: ChsedBudget,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationChsedBudgetEdit', component: ChsedBudgetEdit },
					{ path: 'create', name: 'SoftCalibrationChsedBudgetCreate', component: ChsedBudgetCreate }
				]  
			},
			{ 
				path: 'chsedparms', name: 'SoftCalibrationChsedParms', component: ChsedParms,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationChsedParmsEdit', component: ChsedParmsEdit },
					{ path: 'create', name: 'SoftCalibrationChsedParmsCreate', component: ChsedParmsCreate }
				]  
			},
			{ 
				path: 'plant', name: 'SoftCalibrationPlantGro', component: PlantGro,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationPlantGroEdit', component: PlantGroEdit },
					{ path: 'create', name: 'SoftCalibrationPlantGroCreate', component: PlantGroCreate }
				]  
			},
			{ 
				path: 'plantparms', name: 'SoftCalibrationPlantParms', component: PlantParms,
				children: [
					{ path: 'edit/:id', name: 'SoftCalibrationPlantParmsEdit', component: PlantParmsEdit },
					{ path: 'create', name: 'SoftCalibrationPlantParmsCreate', component: PlantParmsCreate }
				]  
			},
		]
	}
];