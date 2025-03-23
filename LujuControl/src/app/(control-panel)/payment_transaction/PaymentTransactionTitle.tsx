import { useGetPaymentTransactionItemQuery } from './PaymentTransactionApi';

type PaymentTransactionTitleProps = {
	payment_transactionId?: string;
};

function PaymentTransactionTitle(props: PaymentTransactionTitleProps) {
	const { payment_transactionId } = props;
	const { data: payment_transaction } = useGetPaymentTransactionItemQuery(payment_transactionId, {
		skip: !payment_transactionId
	});

	return payment_transaction?.first_name || 'PaymentTransaction';
}

export default PaymentTransactionTitle;