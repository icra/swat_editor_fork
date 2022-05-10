import Vue from 'vue';

import ActionBar from '@/components/ActionBar';
import BackButton from '@/components/BackButton';
import ErrorAlert from '@/components/ErrorAlert';
import FileHeader from '@/components/FileHeader';
import GridView from '@/components/GridView';
import OpenFile from '@/components/OpenFile';
import OpenInBrowser from '@/components/OpenInBrowser';
import PageLoading from '@/components/PageLoading';
import ProjectContainer from '@/components/ProjectContainer';
import ReferenceLabel from '@/components/ReferenceLabel';
import SaveButton from '@/components/SaveButton';
import SelectFileInput from '@/components/SelectFileInput';
import SelectFolderInput from '@/components/SelectFolderInput';
import StackTraceError from '@/components/StackTraceError';
import TypeAhead from '@/components/TypeAhead';
import TypeAheadAndGo from '@/components/TypeAheadAndGo';
import TypeAheadAndBrowse from '@/components/TypeAheadAndBrowse';
import ConnectGridView from '@/components/ConnectGridView';

Vue.component('action-bar', ActionBar);
Vue.component('back-button', BackButton);
Vue.component('error-alert', ErrorAlert);
Vue.component('file-header', FileHeader);
Vue.component('grid-view', GridView);
Vue.component('open-file', OpenFile);
Vue.component('open-in-browser', OpenInBrowser);
Vue.component('page-loading', PageLoading);
Vue.component('project-container', ProjectContainer);
Vue.component('reference-label', ReferenceLabel);
Vue.component('save-button', SaveButton);
Vue.component('select-file-input', SelectFileInput);
Vue.component('select-folder-input', SelectFolderInput);
Vue.component('stack-trace-error', StackTraceError);
Vue.component('type-ahead', TypeAhead);
Vue.component('type-ahead-and-go', TypeAheadAndGo);
Vue.component('type-ahead-and-browse', TypeAheadAndBrowse);
Vue.component('connect-grid-view', ConnectGridView);
