import { Routes } from '@angular/router';
import { List } from './pages/ticket/list/list';
import { Manage } from './pages/ticket/manage/manage';

export const routes: Routes = [
	{ path: '', component: List },
	{ path: 'ticket/manage', component: Manage }
];
