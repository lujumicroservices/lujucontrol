'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import FacilityHeader from './FacilityHeader';
import FacilityList from './facility-list/FacilityList';
import { useGetFacilityListQuery, useGetFacilityCountriesQuery } from './FacilityApi';
import FacilitySidebarContent from './FacilitySidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type FacilityAppProps = {
	children?: React.ReactNode;
};

/**
 * The FacilityApp page.
 */
function FacilityApp(props: FacilityAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetFacilityListQuery();
	useGetFacilityCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.facilityId);
	}, [routeParams]);

	return (
		<Root
			header={<FacilityHeader />}
			content={<FacilityList />}
			ref={pageLayout}
			rightSidebarContent={<FacilitySidebarContent>{children}</FacilitySidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/facility')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default FacilityApp;