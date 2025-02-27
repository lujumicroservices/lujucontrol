import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Resident App slice.
 */
export const residentAppSlice = createSlice({
	name: 'residentApp',
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
rootReducer.inject(residentAppSlice);
const injectedSlice = residentAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof residentAppSlice> {}
}

export const { setSearchText, resetSearchText } = residentAppSlice.actions;

export type searchTextSliceType = typeof residentAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = residentAppSlice.reducer;

export default searchTextReducer;