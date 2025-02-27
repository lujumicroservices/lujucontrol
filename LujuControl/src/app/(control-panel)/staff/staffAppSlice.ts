import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Staff App slice.
 */
export const staffAppSlice = createSlice({
	name: 'staffApp',
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
rootReducer.inject(staffAppSlice);
const injectedSlice = staffAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof staffAppSlice> {}
}

export const { setSearchText, resetSearchText } = staffAppSlice.actions;

export type searchTextSliceType = typeof staffAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = staffAppSlice.reducer;

export default searchTextReducer;
