import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The Maintenance App slice.
 */
export const maintenanceAppSlice = createSlice({
	name: 'maintenanceApp',
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
rootReducer.inject(maintenanceAppSlice);
const injectedSlice = maintenanceAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof maintenanceAppSlice> {}
}

export const { setSearchText, resetSearchText } = maintenanceAppSlice.actions;

export type searchTextSliceType = typeof maintenanceAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = maintenanceAppSlice.reducer;

export default searchTextReducer;