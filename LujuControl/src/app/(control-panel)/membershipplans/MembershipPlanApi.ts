import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './membershipPlanAppSlice';

export const addTagTypes = ['membershipPlan_item', 'membershipPlan', 'membershipPlan_tag', 'membershipPlan_tags', 'countries'] as const;

const MembershipPlanApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getMembershipPlanList: build.query<GetMembershipPlanListApiResponse, GetMembershipPlanListApiArg>({
				query: () => ({ url: `/api/mock/membershipPlan/items` }),
				providesTags: ['membershipPlan']
			}),
			createMembershipPlanItem: build.mutation<CreateMembershipPlanItemApiResponse, CreateMembershipPlanItemApiArg>({
				query: (queryArg) => ({
					url: `/api/mock/membershipPlan/items`,
					method: 'POST',
					body: queryArg.membershipPlan
				}),
				invalidatesTags: ['membershipPlan']
			}),
			getMembershipPlanItem: build.query<GetMembershipPlanItemApiResponse, GetMembershipPlanItemApiArg>({
				query: (membershipPlanId) => ({
					url: `/api/mock/membershipPlan/items/${membershipPlanId}`
				}),
				providesTags: ['membershipPlan_item']
			}),
			updateMembershipPlanItem: build.mutation<UpdateMembershipPlanItemApiResponse, UpdateMembershipPlanItemApiArg>({
				query: (membershipPlan) => ({
					url: `/api/mock/membershipPlan/items/${membershipPlan.id}`,
					method: 'PUT',
					body: membershipPlan
				}),
				invalidatesTags: ['membershipPlan_item', 'membershipPlan']
			}),
			deleteMembershipPlanItem: build.mutation<DeleteMembershipPlanItemApiResponse, DeleteMembershipPlanItemApiArg>({
				query: (membershipPlanId) => ({
					url: `/api/mock/membershipPlan/items/${membershipPlanId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['membershipPlan']
			}),
			getMembershipPlanCountries: build.query<GetMembershipPlanCountriesApiResponse, GetMembershipPlanCountriesApiArg>({
				query: () => ({ url: `/api/mock/countries` }),
				providesTags: ['countries']
			})
		}),
		overrideExisting: false
	});

export default MembershipPlanApi;

export type GetMembershipPlanItemApiResponse = /** status 200 User Found */ MembershipPlan;
export type GetMembershipPlanItemApiArg = string;

export type UpdateMembershipPlanItemApiResponse = /** status 200 MembershipPlan Updated */ MembershipPlan;
export type UpdateMembershipPlanItemApiArg = MembershipPlan;

export type DeleteMembershipPlanItemApiResponse = unknown;
export type DeleteMembershipPlanItemApiArg = string;

export type GetMembershipPlanListApiResponse = /** status 200 OK */ MembershipPlan[];
export type GetMembershipPlanListApiArg = void;

export type CreateMembershipPlanItemApiResponse = /** status 201 Created */ MembershipPlan;
export type CreateMembershipPlanItemApiArg = {
	membershipPlan: MembershipPlan;
};

export type MembershipPlan = {
	created_at: string | null;
	description: string | null;
	duration_days: number;
	id: string;
	is_active: boolean | null;
	name: string;
	price: number;
	updated_at: string | null;
};


export type Country = {
	id?: string;
	title?: string;
	iso?: string;
	code?: string;
	flagImagePos?: string;
};

export type GroupedMembershipPlan = {
	group: string;
	children?: MembershipPlan[];
};

export type AccumulatorType = Record<string, GroupedMembershipPlan>;

export const {
	useGetMembershipPlanItemQuery,
	useUpdateMembershipPlanItemMutation,
	useDeleteMembershipPlanItemMutation,
	useGetMembershipPlanListQuery,
	useCreateMembershipPlanItemMutation,
	useGetMembershipPlanCountriesQuery
} = MembershipPlanApi;

export type MembershipPlanApiType = {
	[MembershipPlanApi.reducerPath]: ReturnType<typeof MembershipPlanApi.reducer>;
};

/**
 * Select filtered membershipPlan
 */
export const selectFilteredMembershipPlanList = (membershipPlan: MembershipPlan[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!membershipPlan) {
			return [];
		}

		if (searchText.length === 0) {
			return membershipPlan;
		}

		return FuseUtils.filterArrayByString<MembershipPlan>(membershipPlan, searchText);
	});

/**
 * Select grouped membershipPlan
 */
export const selectGroupedFilteredMembershipPlan = (membershipPlan: MembershipPlan[]) =>
	createSelector([selectFilteredMembershipPlanList(membershipPlan)], (filteredMembershipPlan) => {
		if (!filteredMembershipPlan) {
			return [];
		}

		const sortedMembershipPlan = [...filteredMembershipPlan]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedMembershipPlan> = sortedMembershipPlan?.reduce<AccumulatorType>((r, e) => {
			// get first letter of name of current element
			const group = e.name[0];

			// if there is no property in accumulator with this letter create it
			if (!r[group]) r[group] = { group, children: [e] };
			// if there is push current element to children array for that letter
			else {
				r[group]?.children?.push(e);
			}

			// return accumulator
			return r;
		}, {});

		return groupedObject;
	});
