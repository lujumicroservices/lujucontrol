import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { PaymentTransaction } from '../PaymentTransactionApi';
import _ from 'lodash';

/**
 * The payment_transaction model.
 */
const PaymentTransactionModel = (data: PartialDeep<PaymentTransaction>): PaymentTransaction =>
	_.defaults(data || {}, {
		id: uuidv4(),
		player_id: null,
		amount: 0,
		billing_period: '',
		due_date: null,
		payment_date: null,
		status: null,
		late_fee: 0,
		created_at: null,
		updated_at: null,
	});

export default PaymentTransactionModel;
