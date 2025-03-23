import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Users App slice.
 */
export const usersAppSlice = createSlice({
	name: 'usersApp',
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
rootReducer.inject(usersAppSlice);
const injectedSlice = usersAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof usersAppSlice> {}
}

export const { setSearchText, resetSearchText } = usersAppSlice.actions;

export type searchTextSliceType = typeof usersAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = usersAppSlice.reducer;

export default searchTextReducer;