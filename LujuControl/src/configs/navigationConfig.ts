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
		id: 'members',
		title: 'Members',
		translate: 'MEMBERS',
		type: 'item',
		icon: 'heroicons-outline:user-group',
		url: '/members'
	},
	{
		id: 'staff',
		title: 'Staff',
		translate: 'STAFF',
		type: 'item',
		icon: 'heroicons-outline:briefcase',
		url: '/staff'
	},
	{
		id: 'membershipplans',
		title: 'Membership Plans',
		translate: 'MEMBERSHIP_PLANS',
		type: 'item',
		icon: 'heroicons-solid:document-currency-dollar',
		url: '/membershipplans',
	},
	{
		id: 'payments',
		title: 'Payments',
		translate: 'PAYMENTS',
		type: 'group',
		icon: 'heroicons-outline:credit-card',
		children: [
			{
				id: 'payment-records',
				title: 'Payment Records',
				translate: 'PAYMENT_RECORDS',
				type: 'item',
				url: '/payments/records',
			},
			{
				id: 'due-payments',
				title: 'Due Payments',
				translate: 'DUE_PAYMENTS',
				type: 'item',
				url: '/payments/due',
			},
		],
	},
	{
		id: 'classes',
		title: 'Classes/Activities',
		translate: 'CLASSES',
		type: 'group',
		icon: 'heroicons-outline:calendar',
		children: [
			{
				id: 'class-schedule',
				title: 'Class Schedule',
				translate: 'CLASS_SCHEDULE',
				type: 'item',
				url: '/classes/schedule',
			},
			{
				id: 'bookings',
				title: 'Bookings',
				translate: 'BOOKINGS',
				type: 'item',
				url: '/classes/bookings',
			},
		],
	},
	{
		id: 'access-control',
		title: 'Access Control',
		translate: 'ACCESS_CONTROL',
		type: 'item',
		icon: 'heroicons-outline:lock-closed',
		url: '/access-control',
	},
	{
		id: 'reports',
		title: 'Reports',
		translate: 'REPORTS',
		type: 'item',
		icon: 'heroicons-outline:chart-bar',
		url: '/reports',
	},
];

export default navigationConfig;
