import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './membersAppSlice';

export const addTagTypes = ['members_item', 'members', 'members_tag', 'members_tags', 'countries'] as const;

const MembersApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getMembersList: build.query<GetMembersListApiResponse, GetMembersListApiArg>({
				query: () => ({ url: `/api/mock/members/items` }),
				providesTags: ['members']
			}),
			createMembersItem: build.mutation<CreateMembersItemApiResponse, CreateMembersItemApiArg>({
				query: (queryArg) => ({
					url: `/api/mock/members/items`,
					method: 'POST',
					body: queryArg.member
				}),
				invalidatesTags: ['members']
			}),
			getMembersItem: build.query<GetMembersItemApiResponse, GetMembersItemApiArg>({
				query: (memberId) => ({
					url: `/api/mock/members/items/${memberId}`
				}),
				providesTags: ['members_item']
			}),
			updateMembersItem: build.mutation<UpdateMembersItemApiResponse, UpdateMembersItemApiArg>({
				query: (member) => ({
					url: `/api/mock/members/items/${member.id}`,
					method: 'PUT',
					body: member
				}),
				invalidatesTags: ['members_item', 'members']
			}),
			deleteMembersItem: build.mutation<DeleteMembersItemApiResponse, DeleteMembersItemApiArg>({
				query: (memberId) => ({
					url: `/api/mock/members/items/${memberId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['members']
			}),
			getMembersTag: build.query<GetMembersTagApiResponse, GetMembersTagApiArg>({
				query: (tagId) => ({ url: `/api/mock/members/tags/${tagId}` }),
				providesTags: ['members_tag']
			}),
			updateMembersTag: build.mutation<UpdateMembersTagApiResponse, UpdateMembersTagApiArg>({
				query: (tag) => ({
					url: `/api/mock/members/tags/${tag.id}`,
					method: 'PUT',
					body: tag
				}),
				invalidatesTags: ['members_tags']
			}),
			deleteMembersTag: build.mutation<DeleteMembersTagApiResponse, DeleteMembersTagApiArg>({
				query: (tagId) => ({
					url: `/api/mock/members/tags/${tagId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['members_tags']
			}),
			getMembersTags: build.query<GetMembersTagsApiResponse, GetMembersTagsApiArg>({
				query: () => ({ url: `/api/mock/members/tags` }),
				providesTags: ['members_tags']
			}),
			getMembersCountries: build.query<GetMembersCountriesApiResponse, GetMembersCountriesApiArg>({
				query: () => ({ url: `/api/mock/countries` }),
				providesTags: ['countries']
			}),
			createMembersTag: build.mutation<CreateMembersTagApiResponse, CreateMembersTagApiArg>({
				query: (queryArg) => ({
					url: `/api/mock/members/tags`,
					method: 'POST',
					body: queryArg.tag
				}),
				invalidatesTags: ['members_tags']
			})
		}),
		overrideExisting: false
	});

export default MembersApi;

export type GetMembersItemApiResponse = /** status 200 User Found */ Members;
export type GetMembersItemApiArg = string;

export type UpdateMembersItemApiResponse = /** status 200 Members Updated */ Members;
export type UpdateMembersItemApiArg = Members;

export type DeleteMembersItemApiResponse = unknown;
export type DeleteMembersItemApiArg = number;

export type GetMembersListApiResponse = /** status 200 OK */ Members[];
export type GetMembersListApiArg = void;

export type CreateMembersItemApiResponse = /** status 201 Created */ Members;
export type CreateMembersItemApiArg = {
	member: Members;
};

export type MembersPhoneNumber = {
	country: string;
	phoneNumber: string;
	label?: string;
};

export type MembersEmail = {
	email: string;
	label?: string;
};

export type Members = {
	address_line_1: string;
	address_line_2: string | null;
	birthdate: string;
	city: string;
	country: string;
	created_at: string | null;
	email: string;
	end_date: string;
	first_name: string;
	id: number | null;
	last_name: string;
	membership_id: number | null;
	phone: string | null;
	postal_code: string;
	start_date: string;
	state: string;
	updated_at: string | null;
};

// Utility function for derived/composed fields
export const getMemberDisplayData = (memberData: Members) => ({
	fullName: `${memberData.first_name} ${memberData.last_name}`,
	fullAddress: `${memberData.address_line_1}, ${memberData.address_line_2 ? memberData.address_line_2 + ", " : ""}${memberData.city}, ${memberData.state}, ${memberData.country} - ${memberData.postal_code}`,
});


export type Country = {
	id?: string;
	title?: string;
	iso?: string;
	code?: string;
	flagImagePos?: string;
};

export type GroupedMembers = {
	group: string;
	children?: Members[];
};

export type AccumulatorType = Record<string, GroupedMembers>;

export const {
	useGetMembersItemQuery,
	useUpdateMembersItemMutation,
	useDeleteMembersItemMutation,
	useGetMembersListQuery,
	useCreateMembersItemMutation,
	useGetMembersTagQuery,
	useGetMembersCountriesQuery,
	useUpdateMembersTagMutation,
	useDeleteMembersTagMutation,
	useGetMembersTagsQuery,
	useCreateMembersTagMutation
} = MembersApi;

export type MembersApiType = {
	[MembersApi.reducerPath]: ReturnType<typeof MembersApi.reducer>;
};

/**
 * Select filtered members
 */
export const selectFilteredMembersList = (members: Members[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!members) {
			return [];
		}

		if (searchText.length === 0) {
			return members;
		}

		return FuseUtils.filterArrayByString<Members>(members, searchText);
	});

/**
 * Select grouped members
 */
export const selectGroupedFilteredMembers = (members: Members[]) =>
	createSelector([selectFilteredMembersList(members)], (filteredMembers) => {
		if (!filteredMembers) {
			return [];
		}

		const sortedMembers = [...filteredMembers]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedMembers> = sortedMembers?.reduce<AccumulatorType>((r, e) => {
			// get first letter of name of current element
			const group = e.first_name[0];

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
