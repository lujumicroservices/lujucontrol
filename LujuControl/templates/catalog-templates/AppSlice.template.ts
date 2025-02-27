import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The {{moduleName}} App slice.
 */
export const {{moduleNameLower}}AppSlice = createSlice({
	name: '{{moduleNameLower}}App',
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
rootReducer.inject({{moduleNameLower}}AppSlice);
const injectedSlice = {{moduleNameLower}}AppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof {{moduleNameLower}}AppSlice> {}
}

export const { setSearchText, resetSearchText } = {{moduleNameLower}}AppSlice.actions;

export type searchTextSliceType = typeof {{moduleNameLower}}AppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = {{moduleNameLower}}AppSlice.reducer;

export default searchTextReducer;