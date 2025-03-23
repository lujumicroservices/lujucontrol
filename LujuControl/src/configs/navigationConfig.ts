import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import es from './navigation-i18n/es';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);
i18n.addResourceBundle('es', 'navigation', es);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		translate: 'DASHBOARD',
		type: 'item',
		icon: 'heroicons-outline:home',
		url: '/dashboard',
	},
	{
		id: 'users',
		title: 'Users',
		translate: 'USERS',
		type: 'item',
		icon: 'heroicons-outline:user-group',
		url: '/users'
	},
	{
		id: 'player',
		title: 'Players',
		translate: 'PLAYERS',
		type: 'item',
		icon: 'heroicons-outline:user-group',
		url: '/player'
	},
	{
		id: 'settings',
		title: 'Settings',
		translate: 'SETTINGS',
		type: 'item',
		icon: 'heroicons-outline:user-group',
		url: '/settings'
	},
	{
		id: 'reports',
		title: 'Reports',
		translate: 'REPORTS',
		type: 'item',
		icon: 'heroicons-outline:chart-bar',
		url: '/reports',
	}
];

export default navigationConfig;
