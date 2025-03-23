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
			getPlayerPaymentItem: build.query<GetPlayerPaymentItemApiResponse, GetPlayerPaymentItemApiArg>({
				query: (player_id) => ({ url: `/api/mock/payment_transaction/items/${player_id}` }),
				providesTags: ['payment_transaction']
			}),
			getPaymentTransactionList: build.query<
				GetPaymentTransactionListApiResponse,
				GetPaymentTransactionListApiArg
			>({
				query: (player_id) => ({ url: `/api/mock/payment_transaction/items/${player_id}` }),
				providesTags: ['payment_transaction']
			}),
			createPaymentTransactionItem: build.mutation<
				CreatePaymentTransactionItemApiResponse,
				CreatePaymentTransactionItemApiArg
			>({
				query: (queryArg) => ({
					url: `/api/mock/payment_transaction/items`,
					method: 'POST',
					body: queryArg.payment_transaction
				}),
				invalidatesTags: ['payment_transaction']
			}),
			getPaymentTransactionItem: build.query<
				GetPaymentTransactionItemApiResponse,
				GetPaymentTransactionItemApiArg
			>({
				query: (payment_transactionId) => ({
					url: `/api/mock/payment_transaction/items/${payment_transactionId}`
				}),
				providesTags: ['payment_transaction_item']
			}),
			updatePaymentTransactionItem: build.mutation<
				UpdatePaymentTransactionItemApiResponse,
				UpdatePaymentTransactionItemApiArg
			>({
				query: (payment_transaction) => ({
					url: `/api/mock/payment_transaction/items/${payment_transaction.id}`,
					method: 'PUT',
					body: payment_transaction
				}),
				invalidatesTags: ['payment_transaction_item', 'payment_transaction']
			}),
			deletePaymentTransactionItem: build.mutation<
				DeletePaymentTransactionItemApiResponse,
				DeletePaymentTransactionItemApiArg
			>({
				query: (payment_transactionId) => ({
					url: `/api/mock/payment_transaction/items/${payment_transactionId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['payment_transaction']
			})
		}),
		overrideExisting: false
	});

export default PaymentTransactionApi;

export type GetPlayerPaymentItemApiResponse = /** status 200 User Found */ Payments;
export type GetPlayerPaymentItemApiArg = string;

export type GetPaymentTransactionItemApiResponse = /** status 200 User Found */ PaymentTransaction;
export type GetPaymentTransactionItemApiArg = string;

export type UpdatePaymentTransactionItemApiResponse = /** status 200 PaymentTransaction Updated */ PaymentTransaction;
export type UpdatePaymentTransactionItemApiArg = PaymentTransaction;

export type DeletePaymentTransactionItemApiResponse = unknown;
export type DeletePaymentTransactionItemApiArg = string;

export type GetPaymentTransactionListApiResponse = /** status 200 OK */ PaymentTransaction[];
export type GetPaymentTransactionListApiArg = string;

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
	useGetPaymentTransactionItemQuery,
	useUpdatePaymentTransactionItemMutation,
	useDeletePaymentTransactionItemMutation,
	useGetPaymentTransactionListQuery,
	useCreatePaymentTransactionItemMutation,
	useGetPlayerPaymentItemQuery
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
