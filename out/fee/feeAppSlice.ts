import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Fee App slice.
 */
export const feeAppSlice = createSlice({
	name: 'feeApp',
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
rootReducer.inject(feeAppSlice);
const injectedSlice = feeAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof feeAppSlice> {}
}

export const { setSearchText, resetSearchText } = feeAppSlice.actions;

export type searchTextSliceType = typeof feeAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = feeAppSlice.reducer;

export default searchTextReducer;