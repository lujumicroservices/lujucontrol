import FuseNavigation from '@fuse/core/FuseNavigation';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import Typography from '@mui/material/Typography';

/**
 * Navigation data
 */
const navigationData: FuseNavItemType[] = [
	{
		id: '1',
		title: 'Actions',
		subtitle: 'Task, project & team',
		type: 'group',
		children: [
			{
				id: '1.1',
				title: 'Create task',
				type: 'item',
				icon: 'heroicons-outline:plus-circle'
			},
			{
				id: '1.2',
				title: 'Create team',
				type: 'item',
				icon: 'heroicons-outline:user-group'
			},
			{
				id: '1.3',
				title: 'Create project',
				type: 'item',
				icon: 'heroicons-outline:briefcase'
			},
			{
				id: '1.4',
				title: 'Create user',
				type: 'item',
				icon: 'heroicons-outline:user-plus'
			},
			{
				id: '1.5',
				title: 'Assign user or team',
				subtitle: 'Assign to a task or a project',
				type: 'item',
				icon: 'heroicons-outline:badge-check'
			}
		]
	},
	{
		id: '2',
		title: 'Tasks',
		type: 'group',
		children: [
			{
				id: '2.1',
				title: 'All tasks',
				type: 'item',
				icon: 'heroicons-outline:clipboard-document-list',
				badge: {
					title: '49',
					classes: 'px-2 bg-primary text-on-primary rounded-full'
				}
			},
			{
				id: '2.2',
				title: 'Ongoing tasks',
				type: 'item',
				icon: 'heroicons-outline:clipboard-copy'
			},
			{
				id: '2.3',
				title: 'Completed tasks',
				type: 'item',
				icon: 'heroicons-outline:clipboard-check'
			},
			{
				id: '2.4',
				title: 'Abandoned tasks',
				type: 'item',
				icon: 'heroicons-outline:clipboard'
			},
			{
				id: '2.5',
				title: 'Assigned to me',
				type: 'item',
				icon: 'heroicons-outline:user'
			},
			{ id: '2.6', title: 'Assigned to my team', type: 'item', icon: 'heroicons-outline:users' }
		]
	},
	{
		id: '3',
		title: 'Settings',
		type: 'group',
		children: [
			{
				id: '3.1',
				title: 'General',
				type: 'collapse',
				icon: 'heroicons-outline:cog-6-tooth',
				children: [
					{
						id: '3.1.1',
						title: 'Tasks',
						type: 'item'
					},
					{
						id: '3.1.2',
						title: 'Users',
						type: 'item'
					},
					{
						id: '3.1.3',
						title: 'Teams',
						type: 'item'
					}
				]
			},
			{
				id: '3.2',
				title: 'Account',
				type: 'collapse',
				icon: 'heroicons-outline:user-circle',
				children: [
					{
						id: '3.2.1',
						title: 'Personal',
						type: 'item'
					},
					{
						id: '3.2.2',
						title: 'Payment',
						type: 'item'
					},
					{
						id: '3.2.3',
						title: 'Security',
						type: 'item'
					}
				]
			}
		]
	},
	{
		id: '4',
		type: 'divider'
	}
];

/**
 * The DemoSidebar component.
 */
function DemoSidebar() {
	return (
		<div className="py-6 min-h-6xl">
			<div className="px-6 pb-4">
				<Typography className="text-3xl font-bold tracking-tighter">Demo Sidebar</Typography>
			</div>
			<FuseNavigation
				navigation={navigationData}
				className=""
			/>
		</div>
	);
}

export default DemoSidebar;
