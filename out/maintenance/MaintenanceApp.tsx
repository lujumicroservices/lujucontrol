'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import MaintenanceHeader from './MaintenanceHeader';
import MaintenanceList from './maintenance-list/MaintenanceList';
import { useGetMaintenanceListQuery, useGetMaintenanceCountriesQuery } from './MaintenanceApi';
import MaintenanceSidebarContent from './MaintenanceSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type MaintenanceAppProps = {
	children?: React.ReactNode;
};

/**
 * The MaintenanceApp page.
 */
function MaintenanceApp(props: MaintenanceAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetMaintenanceListQuery();
	useGetMaintenanceCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.maintenanceId);
	}, [routeParams]);

	return (
		<Root
			header={<MaintenanceHeader />}
			content={<MaintenanceList />}
			ref={pageLayout}
			rightSidebarContent={<MaintenanceSidebarContent>{children}</MaintenanceSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/maintenance')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default MaintenanceApp;