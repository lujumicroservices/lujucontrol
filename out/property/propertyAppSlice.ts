import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Property App slice.
 */
export const propertyAppSlice = createSlice({
	name: 'propertyApp',
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
rootReducer.inject(propertyAppSlice);
const injectedSlice = propertyAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof propertyAppSlice> {}
}

export const { setSearchText, resetSearchText } = propertyAppSlice.actions;

export type searchTextSliceType = typeof propertyAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = propertyAppSlice.reducer;

export default searchTextReducer;