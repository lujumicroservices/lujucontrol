'use client';

import { redirect, useParams } from 'next/navigation';
import PaymentTransactionForm from '../payment_transaction-form/PaymentTransactionForm';

function PaymentTransactionPage() {
	const { payment_transactionId } = useParams<{ payment_transactionId: string }>();

	if (payment_transactionId === 'new') {
		return <PaymentTransactionForm isNew />;
	}

	redirect(`/payment_transaction/${ payment_transactionId}/view`);

	return null;
}

export default PaymentTransactionPage;
