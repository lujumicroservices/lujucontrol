import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Facility App slice.
 */
export const facilityAppSlice = createSlice({
	name: 'facilityApp',
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
rootReducer.inject(facilityAppSlice);
const injectedSlice = facilityAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof facilityAppSlice> {}
}

export const { setSearchText, resetSearchText } = facilityAppSlice.actions;

export type searchTextSliceType = typeof facilityAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = facilityAppSlice.reducer;

export default searchTextReducer;