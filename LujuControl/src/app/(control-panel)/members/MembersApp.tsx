'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import MembersHeader from './MembersHeader';
import MembersList from './members-list/MembersList';
import { useGetMembersListQuery, useGetMembersCountriesQuery, useGetMembersTagsQuery } from './MembersApi';
import MembersSidebarContent from './MembersSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type MembersAppProps = {
	children?: React.ReactNode;
};

/**
 * The MembersApp page.
 */
function MembersApp(props: MembersAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetMembersListQuery();
	useGetMembersCountriesQuery();
	useGetMembersTagsQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.memberId);
	}, [routeParams]);

	return (
		<Root
			header={<MembersHeader />}
			content={<MembersList />}
			ref={pageLayout}
			rightSidebarContent={<MembersSidebarContent>{children}</MembersSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/members')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default MembersApp;
