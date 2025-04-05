'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import UsersHeader from './UsersHeader';
import UsersList from './users-list/UsersList';
import { useGetUsersListQuery, useGetUsersCountriesQuery } from './UsersApi';
import UsersSidebarContent from './UsersSidebarContent';
import './i18n';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type UsersAppProps = {
	children?: React.ReactNode;
};

/**
 * The UsersApp page.
 */
function UsersApp(props: UsersAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetUsersListQuery();


	useEffect(() => {
		setRightSidebarOpen(!!routeParams.usersId);
	}, [routeParams]);

	return (
		<Root
			header={<UsersHeader />}
			content={<UsersList />}
			ref={pageLayout}
			rightSidebarContent={<UsersSidebarContent>{children}</UsersSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/users')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default UsersApp;