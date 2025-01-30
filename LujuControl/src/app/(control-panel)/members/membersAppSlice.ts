import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Members App slice.
 */
export const membersAppSlice = createSlice({
	name: 'membersApp',
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
rootReducer.inject(membersAppSlice);
const injectedSlice = membersAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof membersAppSlice> {}
}

export const { setSearchText, resetSearchText } = membersAppSlice.actions;

export type searchTextSliceType = typeof membersAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = membersAppSlice.reducer;

export default searchTextReducer;
