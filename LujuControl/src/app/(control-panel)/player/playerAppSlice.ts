import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Player App slice.
 */
export const playerAppSlice = createSlice({
	name: 'playerApp',
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
rootReducer.inject(playerAppSlice);
const injectedSlice = playerAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof playerAppSlice> {}
}

export const { setSearchText, resetSearchText } = playerAppSlice.actions;

export type searchTextSliceType = typeof playerAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = playerAppSlice.reducer;

export default searchTextReducer;