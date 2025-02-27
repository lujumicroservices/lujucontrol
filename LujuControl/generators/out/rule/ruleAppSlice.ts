import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Rule App slice.
 */
export const ruleAppSlice = createSlice({
	name: 'ruleApp',
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
rootReducer.inject(ruleAppSlice);
const injectedSlice = ruleAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof ruleAppSlice> {}
}

export const { setSearchText, resetSearchText } = ruleAppSlice.actions;

export type searchTextSliceType = typeof ruleAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = ruleAppSlice.reducer;

export default searchTextReducer;