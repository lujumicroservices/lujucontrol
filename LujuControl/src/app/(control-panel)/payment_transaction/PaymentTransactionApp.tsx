'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import PaymentTransactionHeader from './PaymentTransactionHeader';
import PaymentTransactionList from './payment_transaction-list/PaymentTransactionList';
import { useGetPaymentTransactionListQuery, useGetPaymentTransactionCountriesQuery } from './PaymentTransactionApi';
import PaymentTransactionSidebarContent from './PaymentTransactionSidebarContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

type PaymentTransactionAppProps = {
	children?: React.ReactNode;
};

/**
 * The PaymentTransactionApp page.
 */
function PaymentTransactionApp(props: PaymentTransactionAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetPaymentTransactionListQuery();
	useGetPaymentTransactionCountriesQuery();

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.payment_transactionId);
	}, [routeParams]);

	return (
		<Root
			header={<PaymentTransactionHeader />}
			content={<PaymentTransactionList />}
			ref={pageLayout}
			rightSidebarContent={<PaymentTransactionSidebarContent>{children}</PaymentTransactionSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/payment_transaction')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default PaymentTransactionApp;