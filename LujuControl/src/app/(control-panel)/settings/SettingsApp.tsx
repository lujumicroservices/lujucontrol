'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import SettingsHeader from './SettingsHeader';
import SettingsList from './settings-list/SettingsList';
import { useGetSettingsListQuery, useGetSettingsCountriesQuery } from './SettingsApi';
import SettingsSidebarContent from './SettingsSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type SettingsAppProps = {
	children?: React.ReactNode;
};

/**
 * The SettingsApp page.
 */
function SettingsApp(props: SettingsAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetSettingsListQuery();
	useGetSettingsCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.settingsId);
	}, [routeParams]);

	return (
		<Root
			header={<SettingsHeader />}
			content={<SettingsList />}
			ref={pageLayout}
			rightSidebarContent={<SettingsSidebarContent>{children}</SettingsSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/settings')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default SettingsApp;