'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import PropertyHeader from './PropertyHeader';
import PropertyList from './property-list/PropertyList';
import { useGetPropertyListQuery, useGetPropertyCountriesQuery } from './PropertyApi';
import PropertySidebarContent from './PropertySidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type PropertyAppProps = {
	children?: React.ReactNode;
};

/**
 * The PropertyApp page.
 */
function PropertyApp(props: PropertyAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetPropertyListQuery();
	useGetPropertyCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.propertyId);
	}, [routeParams]);

	return (
		<Root
			header={<PropertyHeader />}
			content={<PropertyList />}
			ref={pageLayout}
			rightSidebarContent={<PropertySidebarContent>{children}</PropertySidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/property')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default PropertyApp;