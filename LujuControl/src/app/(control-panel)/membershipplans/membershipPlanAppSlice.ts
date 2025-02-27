import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';

const initialState = { searchText: '' };

/**
 * The MembershipPlan App slice.
 */
export const membershipPlanAppSlice = createSlice({
	name: 'membershipPlanApp',
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
rootReducer.inject(membershipPlanAppSlice);
const injectedSlice = membershipPlanAppSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof membershipPlanAppSlice> {}
}

export const { setSearchText, resetSearchText } = membershipPlanAppSlice.actions;

export type searchTextSliceType = typeof membershipPlanAppSlice;

export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = membershipPlanAppSlice.reducer;

export default searchTextReducer;
