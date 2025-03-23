'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import ViolationHeader from './ViolationHeader';
import ViolationList from './violation-list/ViolationList';
import { useGetViolationListQuery, useGetViolationCountriesQuery } from './ViolationApi';
import ViolationSidebarContent from './ViolationSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type ViolationAppProps = {
	children?: React.ReactNode;
};

/**
 * The ViolationApp page.
 */
function ViolationApp(props: ViolationAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetViolationListQuery();
	useGetViolationCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.violationId);
	}, [routeParams]);

	return (
		<Root
			header={<ViolationHeader />}
			content={<ViolationList />}
			ref={pageLayout}
			rightSidebarContent={<ViolationSidebarContent>{children}</ViolationSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/violation')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default ViolationApp;