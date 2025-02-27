import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './residentAppSlice';

export const addTagTypes = [
  'resident_item',
  'resident',
  'resident_tag',
  'resident_tags',
  'countries',
] as const;

const ResidentApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getResidentList: build.query<GetResidentListApiResponse, GetResidentListApiArg>({
        query: () => ({ url: `/api/mock/resident/items` }),
        providesTags: ['resident'],
      }),
      createResidentItem: build.mutation<CreateResidentItemApiResponse, CreateResidentItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/resident/items`,
          method: 'POST',
          body: queryArg.resident,
        }),
        invalidatesTags: ['resident'],
      }),
      getResidentItem: build.query<GetResidentItemApiResponse, GetResidentItemApiArg>({
        query: (residentId) => ({
          url: `/api/mock/resident/items/${ residentId}`,
        }),
        providesTags: ['resident_item'],
      }),
      updateResidentItem: build.mutation<UpdateResidentItemApiResponse, UpdateResidentItemApiArg>({
        query: (resident) => ({
          url: `/api/mock/resident/items/${ resident.id}`,
          method: 'PUT',
          body: resident,
        }),
        invalidatesTags: ['resident_item', 'resident'],
      }),
      deleteResidentItem: build.mutation<DeleteResidentItemApiResponse, DeleteResidentItemApiArg>({
        query: (residentId) => ({
          url: `/api/mock/resident/items/${ residentId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['resident'],
      }),
      getResidentCountries: build.query<GetResidentCountriesApiResponse, GetResidentCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default ResidentApi;

export type GetResidentItemApiResponse = /** status 200 User Found */ Resident;
export type GetResidentItemApiArg = string;

export type UpdateResidentItemApiResponse = /** status 200 Resident Updated */ Resident;
export type UpdateResidentItemApiArg = Resident;

export type DeleteResidentItemApiResponse = unknown;
export type DeleteResidentItemApiArg = string;

export type GetResidentListApiResponse = /** status 200 OK */ Resident[];
export type GetResidentListApiArg = void;

export type CreateResidentItemApiResponse = /** status 201 Created */ Resident;
export type CreateResidentItemApiArg = {
  resident: Resident;
};

export type Resident = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_id: string;
  role: string;
};

// Utility function for derived/composed fields
export const getResidentDisplayData = (residentData: Resident) => ({
  fullName: `${ residentData.first_name} ${ residentData.last_name}`,
  fullAddress: `${ residentData.address_line_1}, ${ residentData.address_line_2 ? residentData.address_line_2 + ", " : ""}${ residentData.city}, ${ residentData.state}, ${ residentData.country} - ${ residentData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedResident = {
  group: string;
  children?: Resident[];
};

export type AccumulatorType = Record<string, GroupedResident>;

export const {
  useGetResidentItemQuery,
  useUpdateResidentItemMutation,
  useDeleteResidentItemMutation,
  useGetResidentListQuery,
  useCreateResidentItemMutation,
  useGetResidentCountriesQuery,
} = ResidentApi;

export type ResidentApiType = {
  [ResidentApi.reducerPath]: ReturnType<typeof ResidentApi.reducer>;
};

/**
 * Select filtered resident
 */
export const selectFilteredResidentList = (resident: Resident[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!resident) {
      return [];
    }

    if (searchText.length === 0) {
      return resident;
    }

    return FuseUtils.filterArrayByString<Resident>(resident, searchText);
  });

/**
 * Select grouped resident
 */
export const selectGroupedFilteredResident = (resident: Resident[]) =>
  createSelector([selectFilteredResidentList(resident)], (filteredResident) => {
    if (!filteredResident) {
      return [];
    }

    const sortedResident = [...filteredResident]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedResident> = sortedResident?.reduce<AccumulatorType>((r, e) => {
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