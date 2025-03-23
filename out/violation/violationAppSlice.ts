import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Violation App slice.
 */
export const violationAppSlice = createSlice({
	name: 'violationApp',
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
rootReducer.inject(violationAppSlice);
const injectedSlice = violationAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof violationAppSlice> {}
}

export const { setSearchText, resetSearchText } = violationAppSlice.actions;

export type searchTextSliceType = typeof violationAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = violationAppSlice.reducer;

export default searchTextReducer;