'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import PlayerHeader from './PlayerHeader';
import PlayerList from './player-list/PlayerList';
import { useGetPlayerListQuery, useGetPlayerCountriesQuery } from './PlayerApi';
import PlayerSidebarContent from './PlayerSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type PlayerAppProps = {
	children?: React.ReactNode;
};

/**
 * The PlayerApp page.
 */
function PlayerApp(props: PlayerAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetPlayerListQuery();
	useGetPlayerCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.playerId);
	}, [routeParams]);

	return (
		<Root
			header={<PlayerHeader />}
			content={<PlayerList />}
			ref={pageLayout}
			rightSidebarContent={<PlayerSidebarContent>{children}</PlayerSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/player')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default PlayerApp;