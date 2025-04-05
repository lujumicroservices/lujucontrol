import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './payment_transactionAppSlice';

export const addTagTypes = [
	'payment_transaction_item',
	'payment_transaction',
	'payment_transaction_tag',
	'payment_transaction_tags'
] as const;

const PaymentTransactionApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getPlayerPaymentsList: build.query<GetPlayerPaymentsListApiResponse, GetPlayerPaymentsListApiArg>({
				query: (player_id) => ({ url: `/api/mock/payment_transaction/items/${player_id}` }),
				providesTags: ['payment_transaction']
			}),
			getPlayersPaymentStatusList: build.query<GetPlayersPaymentStatusListApiResponse,GetPlayersPaymentStatusListApiArg>({
				query: () => ({ url: `/api/mock/payment_transaction/items` }),
				providesTags: ['payment_transaction']
			})

		}),
		overrideExisting: false
	});

export default PaymentTransactionApi;

export type GetPlayerPaymentsListApiResponse = /** status 200 User Found */ PaymentTransaction[];
export type GetPlayerPaymentsListApiArg = string;

export type GetPlayersPaymentStatusListApiResponse = /** status 200 User Found */ PaymentTransaction[];
export type GetPlayersPaymentStatusListApiArg = void;

export type UpdatePaymentTransactionItemApiResponse = /** status 200 PaymentTransaction Updated */ PaymentTransaction;
export type UpdatePaymentTransactionItemApiArg = PaymentTransaction;

export type DeletePaymentTransactionItemApiResponse = unknown;
export type DeletePaymentTransactionItemApiArg = string;

export type CreatePaymentTransactionItemApiResponse = /** status 201 Created */ PaymentTransaction;
export type CreatePaymentTransactionItemApiArg = {
	payment_transaction: PaymentTransaction;
};

export type PaymentTransaction = {
	id: string;
	player_id: string;
	amount: number;
	billing_period: string;
	due_date: string;
	payment_date: string;
	status: select;
	late_fee: number;
	created_at: date;
	updated_at: date;
};

export type Payments = {
	player_id: string;
	player_name: string;
	last_billing_period: date;
	last_payment_date: date;
	payment_status: string;
};



export type GroupedPaymentTransaction = {
	group: string;
	children?: PaymentTransaction[];
};

export type AccumulatorType = Record<string, GroupedPaymentTransaction>;

export const { 
	useGetPlayerPaymentsListQuery, 
	useGetPlayersPaymentStatusListQuery 
} = PaymentTransactionApi;

export type PaymentTransactionApiType = {
	[PaymentTransactionApi.reducerPath]: ReturnType<typeof PaymentTransactionApi.reducer>;
};

/**
 * Select filtered payment_transaction
 */
export const selectFilteredPaymentTransactionList = (payment_transaction: PaymentTransaction[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!payment_transaction) {
			return [];
		}

		if (searchText.length === 0) {
			return payment_transaction;
		}

		return FuseUtils.filterArrayByString<PaymentTransaction>(payment_transaction, searchText);
	});

/**
 * Select grouped payment_transaction
 */
export const selectGroupedFilteredPaymentTransaction = (payment_transaction: PaymentTransaction[]) =>
	createSelector([selectFilteredPaymentTransactionList(payment_transaction)], (filteredPaymentTransaction) => {
		if (!filteredPaymentTransaction) {
			return [];
		}

		const sortedPaymentTransaction = [...filteredPaymentTransaction]?.sort((a, b) =>
			a?.status?.localeCompare(b.status, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedPaymentTransaction> =
			sortedPaymentTransaction?.reduce<AccumulatorType>((r, e) => {
				// get first letter of name of current element
				const group = e.amount[0];

				// if there is no property in accumulator with this letter create it
				if (!r[group]) r[group] = { group, children: [e] };
				// if there is push current element to children array for that letter
				else {
					r[group]?.children?.push(e);
				}

				// return accumulator
				return r;
			}, {});

		return groupedObject;
	});
