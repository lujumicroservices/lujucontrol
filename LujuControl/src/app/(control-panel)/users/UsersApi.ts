import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './usersAppSlice';

export const addTagTypes = [
  'users_item',
  'users',
  'users_tag',
  'users_tags',
  'countries',
] as const;

const UsersApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUsersList: build.query<GetUsersListApiResponse, GetUsersListApiArg>({
        query: () => ({ url: `/api/mock/users/items` }),
        providesTags: ['users'],
      }),
      createUsersItem: build.mutation<CreateUsersItemApiResponse, CreateUsersItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/users/items`,
          method: 'POST',
          body: queryArg.users,
        }),
        invalidatesTags: ['users'],
      }),
      getUsersItem: build.query<GetUsersItemApiResponse, GetUsersItemApiArg>({
        query: (usersId) => ({
          url: `/api/mock/users/items/${ usersId}`,
        }),
        providesTags: ['users_item'],
      }),
      updateUsersItem: build.mutation<UpdateUsersItemApiResponse, UpdateUsersItemApiArg>({
        query: (users) => ({
          url: `/api/mock/users/items/${ users.id}`,
          method: 'PUT',
          body: users,
        }),
        invalidatesTags: ['users_item', 'users'],
      }),
      deleteUsersItem: build.mutation<DeleteUsersItemApiResponse, DeleteUsersItemApiArg>({
        query: (usersId) => ({
          url: `/api/mock/users/items/${ usersId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['users'],
      }),
      getUsersCountries: build.query<GetUsersCountriesApiResponse, GetUsersCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default UsersApi;

export type GetUsersItemApiResponse = /** status 200 User Found */ Users;
export type GetUsersItemApiArg = string;

export type UpdateUsersItemApiResponse = /** status 200 Users Updated */ Users;
export type UpdateUsersItemApiArg = Users;

export type DeleteUsersItemApiResponse = unknown;
export type DeleteUsersItemApiArg = string;

export type GetUsersListApiResponse = /** status 200 OK */ Users[];
export type GetUsersListApiArg = void;

export type CreateUsersItemApiResponse = /** status 201 Created */ Users;
export type CreateUsersItemApiArg = {
  users: Users;
};

export type Users = {
	id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
  created_at: date;
  updated_at: date;
};


export type GroupedUsers = {
  group: string;
  children?: Users[];
};

export type AccumulatorType = Record<string, GroupedUsers>;

export const {
  useGetUsersItemQuery,
  useUpdateUsersItemMutation,
  useDeleteUsersItemMutation,
  useGetUsersListQuery,
  useCreateUsersItemMutation,
  useGetUsersCountriesQuery,
} = UsersApi;

export type UsersApiType = {
  [UsersApi.reducerPath]: ReturnType<typeof UsersApi.reducer>;
};

/**
 * Select filtered users
 */
export const selectFilteredUsersList = (users: Users[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!users) {
      return [];
    }

    if (searchText.length === 0) {
      return users;
    }

    return FuseUtils.filterArrayByString<Users>(users, searchText);
  });

/**
 * Select grouped users
 */
export const selectGroupedFilteredUsers = (users: Users[]) =>
  createSelector([selectFilteredUsersList(users)], (filteredUsers) => {
    if (!filteredUsers) {
      return [];
    }

    const sortedUsers = [...filteredUsers]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedUsers> = sortedUsers?.reduce<AccumulatorType>((r, e) => {
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