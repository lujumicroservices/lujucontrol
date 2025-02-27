'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import StaffHeader from './StaffHeader';
import StaffList from './staff-list/StaffList';
import { useGetStaffListQuery, useGetStaffCountriesQuery } from './StaffApi';
import StaffSidebarContent from './StaffSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type StaffAppProps = {
	children?: React.ReactNode;
};

/**
 * The StaffApp page.
 */
function StaffApp(props: StaffAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetStaffListQuery();
	useGetStaffCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.staffId);
	}, [routeParams]);

	return (
		<Root
			header={<StaffHeader />}
			content={<StaffList />}
			ref={pageLayout}
			rightSidebarContent={<StaffSidebarContent>{children}</StaffSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/staff')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default StaffApp;
