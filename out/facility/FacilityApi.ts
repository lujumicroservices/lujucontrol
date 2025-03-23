import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './facilityAppSlice';

export const addTagTypes = [
  'facility_item',
  'facility',
  'facility_tag',
  'facility_tags',
  'countries',
] as const;

const FacilityApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getFacilityList: build.query<GetFacilityListApiResponse, GetFacilityListApiArg>({
        query: () => ({ url: `/api/mock/facility/items` }),
        providesTags: ['facility'],
      }),
      createFacilityItem: build.mutation<CreateFacilityItemApiResponse, CreateFacilityItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/facility/items`,
          method: 'POST',
          body: queryArg.facility,
        }),
        invalidatesTags: ['facility'],
      }),
      getFacilityItem: build.query<GetFacilityItemApiResponse, GetFacilityItemApiArg>({
        query: (facilityId) => ({
          url: `/api/mock/facility/items/${ facilityId}`,
        }),
        providesTags: ['facility_item'],
      }),
      updateFacilityItem: build.mutation<UpdateFacilityItemApiResponse, UpdateFacilityItemApiArg>({
        query: (facility) => ({
          url: `/api/mock/facility/items/${ facility.id}`,
          method: 'PUT',
          body: facility,
        }),
        invalidatesTags: ['facility_item', 'facility'],
      }),
      deleteFacilityItem: build.mutation<DeleteFacilityItemApiResponse, DeleteFacilityItemApiArg>({
        query: (facilityId) => ({
          url: `/api/mock/facility/items/${ facilityId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['facility'],
      }),
      getFacilityCountries: build.query<GetFacilityCountriesApiResponse, GetFacilityCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default FacilityApi;

export type GetFacilityItemApiResponse = /** status 200 User Found */ Facility;
export type GetFacilityItemApiArg = string;

export type UpdateFacilityItemApiResponse = /** status 200 Facility Updated */ Facility;
export type UpdateFacilityItemApiArg = Facility;

export type DeleteFacilityItemApiResponse = unknown;
export type DeleteFacilityItemApiArg = string;

export type GetFacilityListApiResponse = /** status 200 OK */ Facility[];
export type GetFacilityListApiArg = void;

export type CreateFacilityItemApiResponse = /** status 201 Created */ Facility;
export type CreateFacilityItemApiArg = {
  facility: Facility;
};

export type Facility = {
  name: string;
  type: string;
  capacity: number;
  rules: string;
};

// Utility function for derived/composed fields
export const getFacilityDisplayData = (facilityData: Facility) => ({
  fullName: `${ facilityData.first_name} ${ facilityData.last_name}`,
  fullAddress: `${ facilityData.address_line_1}, ${ facilityData.address_line_2 ? facilityData.address_line_2 + ", " : ""}${ facilityData.city}, ${ facilityData.state}, ${ facilityData.country} - ${ facilityData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedFacility = {
  group: string;
  children?: Facility[];
};

export type AccumulatorType = Record<string, GroupedFacility>;

export const {
  useGetFacilityItemQuery,
  useUpdateFacilityItemMutation,
  useDeleteFacilityItemMutation,
  useGetFacilityListQuery,
  useCreateFacilityItemMutation,
  useGetFacilityCountriesQuery,
} = FacilityApi;

export type FacilityApiType = {
  [FacilityApi.reducerPath]: ReturnType<typeof FacilityApi.reducer>;
};

/**
 * Select filtered facility
 */
export const selectFilteredFacilityList = (facility: Facility[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!facility) {
      return [];
    }

    if (searchText.length === 0) {
      return facility;
    }

    return FuseUtils.filterArrayByString<Facility>(facility, searchText);
  });

/**
 * Select grouped facility
 */
export const selectGroupedFilteredFacility = (facility: Facility[]) =>
  createSelector([selectFilteredFacilityList(facility)], (filteredFacility) => {
    if (!filteredFacility) {
      return [];
    }

    const sortedFacility = [...filteredFacility]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedFacility> = sortedFacility?.reduce<AccumulatorType>((r, e) => {
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