import DecisionsLum from '@/views/edit/decision_table/Lum';
import DecisionsResRel from '@/views/edit/decision_table/ResRel';
import DecisionsFloCon from '@/views/edit/decision_table/FloCon';
import DecisionsScenLu from '@/views/edit/decision_table/ScenLu';
import DecisionsEdit from '@/views/edit/decision_table/DecisionsEdit';

export default [
	{ path: 'decision_table/edit/:dbtype/:id', name: 'DecisionsEdit', component: DecisionsEdit },
	{ path: 'decision_table/lum', name: 'DecisionsLum', component: DecisionsLum },
	{ path: 'decision_table/res_rel', name: 'DecisionsResRel', component: DecisionsResRel },
	{ path: 'decision_table/flo_con', name: 'DecisionsFloCon', component: DecisionsFloCon },
	{ path: 'decision_table/scen_lu', name: 'DecisionsScenLu', component: DecisionsScenLu }
];