'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import FeeHeader from './FeeHeader';
import FeeList from './fee-list/FeeList';
import { useGetFeeListQuery, useGetFeeCountriesQuery } from './FeeApi';
import FeeSidebarContent from './FeeSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type FeeAppProps = {
	children?: React.ReactNode;
};

/**
 * The FeeApp page.
 */
function FeeApp(props: FeeAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetFeeListQuery();
	useGetFeeCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.feeId);
	}, [routeParams]);

	return (
		<Root
			header={<FeeHeader />}
			content={<FeeList />}
			ref={pageLayout}
			rightSidebarContent={<FeeSidebarContent>{children}</FeeSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/fee')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default FeeApp;