'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import RuleHeader from './RuleHeader';
import RuleList from './rule-list/RuleList';
import { useGetRuleListQuery, useGetRuleCountriesQuery } from './RuleApi';
import RuleSidebarContent from './RuleSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type RuleAppProps = {
	children?: React.ReactNode;
};

/**
 * The RuleApp page.
 */
function RuleApp(props: RuleAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetRuleListQuery();
	useGetRuleCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.ruleId);
	}, [routeParams]);

	return (
		<Root
			header={<RuleHeader />}
			content={<RuleList />}
			ref={pageLayout}
			rightSidebarContent={<RuleSidebarContent>{children}</RuleSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/rule')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default RuleApp;