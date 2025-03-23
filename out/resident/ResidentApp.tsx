'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import ResidentHeader from './ResidentHeader';
import ResidentList from './resident-list/ResidentList';
import { useGetResidentListQuery, useGetResidentCountriesQuery } from './ResidentApi';
import ResidentSidebarContent from './ResidentSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type ResidentAppProps = {
	children?: React.ReactNode;
};

/**
 * The ResidentApp page.
 */
function ResidentApp(props: ResidentAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetResidentListQuery();
	useGetResidentCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.residentId);
	}, [routeParams]);

	return (
		<Root
			header={<ResidentHeader />}
			content={<ResidentList />}
			ref={pageLayout}
			rightSidebarContent={<ResidentSidebarContent>{children}</ResidentSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/resident')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default ResidentApp;