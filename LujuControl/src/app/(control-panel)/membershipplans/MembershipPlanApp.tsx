'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import MembershipPlanHeader from './MembershipPlanHeader';
import MembershipPlanList from './membershipPlan-list/MembershipPlanList';
import { useGetMembershipPlanListQuery, useGetMembershipPlanCountriesQuery } from './MembershipPlanApi';
import MembershipPlanSidebarContent from './MembershipPlanSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type MembershipPlanAppProps = {
	children?: React.ReactNode;
};

/**
 * The MembershipPlanApp page.
 */
function MembershipPlanApp(props: MembershipPlanAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetMembershipPlanListQuery();
	useGetMembershipPlanCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.membershipPlanId);
	}, [routeParams]);

	return (
		<Root
			header={<MembershipPlanHeader />}
			content={<MembershipPlanList />}
			ref={pageLayout}
			rightSidebarContent={<MembershipPlanSidebarContent>{children}</MembershipPlanSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/membershipPlan')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default MembershipPlanApp;
