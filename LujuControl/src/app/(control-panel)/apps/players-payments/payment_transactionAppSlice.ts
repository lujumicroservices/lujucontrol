import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The PaymentTransaction App slice.
 */
export const payment_transactionAppSlice = createSlice({
	name: 'payment_transactionApp',
	initialState,
	reducers: {
		setSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload as string;
			},
			prepare: (event: React.ChangeEvent<HTMLInputElement>) => ({
				payload: `${event?.target?.value}` || '',
				meta: undefined,
				error: null
			})
		},
		resetSearchText: (state) => {
			state.searchText = initialState.searchText;
		}
	},
	selectors: {
		selectSearchText: (state) => state.searchText
	}
});

/**
 * Lazy load
 * */
rootReducer.inject(payment_transactionAppSlice);
const injectedSlice = payment_transactionAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof payment_transactionAppSlice> {}
}

export const { setSearchText, resetSearchText } = payment_transactionAppSlice.actions;

export type searchTextSliceType = typeof payment_transactionAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = payment_transactionAppSlice.reducer;

export default searchTextReducer;