import { v4 as uuidv4 } from 'uuid';
import { PartialDeep } from 'type-fest';
import { PaymentTransaction, Payments } from '../PaymentTransactionApi';
import _ from 'lodash';

/**
 * The payment_transaction model.
 */
export const PaymentTransactionModel = (data: PartialDeep<PaymentTransaction>): PaymentTransaction =>
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

export const PaymentsModel = (data: PartialDeep<Payments>): Payments => 
	_.defaults(data || {}, {
		player_id: null,
		player_name: '',
		last_billing_period: null,
		last_payment_date: null,
		payment_status: '',
});

