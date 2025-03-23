import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Settings App slice.
 */
export const settingsAppSlice = createSlice({
	name: 'settingsApp',
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
rootReducer.inject(settingsAppSlice);
const injectedSlice = settingsAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof settingsAppSlice> {}
}

export const { setSearchText, resetSearchText } = settingsAppSlice.actions;

export type searchTextSliceType = typeof settingsAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = settingsAppSlice.reducer;

export default searchTextReducer;