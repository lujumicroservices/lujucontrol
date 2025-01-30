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
					body: queryArg.contact
				}),
				invalidatesTags: ['members']
			}),
			getMembersItem: build.query<GetMembersItemApiResponse, GetMembersItemApiArg>({
				query: (contactId) => ({
					url: `/api/mock/members/items/${contactId}`
				}),
				providesTags: ['members_item']
			}),
			updateMembersItem: build.mutation<UpdateMembersItemApiResponse, UpdateMembersItemApiArg>({
				query: (contact) => ({
					url: `/api/mock/members/items/${contact.id}`,
					method: 'PUT',
					body: contact
				}),
				invalidatesTags: ['members_item', 'members']
			}),
			deleteMembersItem: build.mutation<DeleteMembersItemApiResponse, DeleteMembersItemApiArg>({
				query: (contactId) => ({
					url: `/api/mock/members/items/${contactId}`,
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
export type DeleteMembersItemApiArg = string;

export type GetMembersListApiResponse = /** status 200 OK */ Members[];
export type GetMembersListApiArg = void;

export type CreateMembersItemApiResponse = /** status 201 Created */ Members;
export type CreateMembersItemApiArg = {
	contact: Members;
};

export type GetMembersTagApiResponse = /** status 200 Tag Found */ Tag;
export type GetMembersTagApiArg = string;

export type GetMembersCountriesApiResponse = /** status 200 */ Country[];
export type GetMembersCountriesApiArg = void;

export type UpdateMembersTagApiResponse = /** status 200 */ Tag;
export type UpdateMembersTagApiArg = Tag;

export type DeleteMembersTagApiResponse = unknown;
export type DeleteMembersTagApiArg = string;

export type GetMembersTagsApiResponse = /** status 200 OK */ Tag[];
export type GetMembersTagsApiArg = void;

export type CreateMembersTagApiResponse = /** status 200 OK */ Tag;
export type CreateMembersTagApiArg = {
	tag: Tag;
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
	id: string;
	avatar?: string;
	background?: string;
	name: string;
	emails?: MembersEmail[];
	phoneNumbers?: MembersPhoneNumber[];
	title?: string;
	company?: string;
	birthday?: string;
	address?: string;
	notes?: string;
	tags?: string[];
};

export type Tag = {
	id: string;
	title: string;
};

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
	createSelector([selectFilteredMembersList(members)], (members) => {
		if (!members) {
			return [];
		}

		const sortedMembers = [...members]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedMembers> = sortedMembers?.reduce<AccumulatorType>((r, e) => {
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
