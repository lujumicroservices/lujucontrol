'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import {{moduleName}}Header from './{{moduleName}}Header';
import {{moduleName}}List from './{{moduleNameLower}}-list/{{moduleName}}List';
import { useGet{{moduleName}}ListQuery, useGet{{moduleName}}CountriesQuery } from './{{moduleName}}Api';
import {{moduleName}}SidebarContent from './{{moduleName}}SidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type {{moduleName}}AppProps = {
	children?: React.ReactNode;
};

/**
 * The {{moduleName}}App page.
 */
function {{moduleName}}App(props: {{moduleName}}AppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGet{{moduleName}}ListQuery();
	useGet{{moduleName}}CountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.{{moduleNameLower}}Id);
	}, [routeParams]);

	return (
		<Root
			header={<{{moduleName}}Header />}
			content={<{{moduleName}}List />}
			ref={pageLayout}
			rightSidebarContent={<{{moduleName}}SidebarContent>{children}</{{moduleName}}SidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/{{moduleNameLower}}')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default {{moduleName}}App;