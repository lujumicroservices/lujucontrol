import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './violationAppSlice';

export const addTagTypes = [
  'violation_item',
  'violation',
  'violation_tag',
  'violation_tags',
  'countries',
] as const;

const ViolationApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getViolationList: build.query<GetViolationListApiResponse, GetViolationListApiArg>({
        query: () => ({ url: `/api/mock/violation/items` }),
        providesTags: ['violation'],
      }),
      createViolationItem: build.mutation<CreateViolationItemApiResponse, CreateViolationItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/violation/items`,
          method: 'POST',
          body: queryArg.violation,
        }),
        invalidatesTags: ['violation'],
      }),
      getViolationItem: build.query<GetViolationItemApiResponse, GetViolationItemApiArg>({
        query: (violationId) => ({
          url: `/api/mock/violation/items/${ violationId}`,
        }),
        providesTags: ['violation_item'],
      }),
      updateViolationItem: build.mutation<UpdateViolationItemApiResponse, UpdateViolationItemApiArg>({
        query: (violation) => ({
          url: `/api/mock/violation/items/${ violation.id}`,
          method: 'PUT',
          body: violation,
        }),
        invalidatesTags: ['violation_item', 'violation'],
      }),
      deleteViolationItem: build.mutation<DeleteViolationItemApiResponse, DeleteViolationItemApiArg>({
        query: (violationId) => ({
          url: `/api/mock/violation/items/${ violationId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['violation'],
      }),
      getViolationCountries: build.query<GetViolationCountriesApiResponse, GetViolationCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default ViolationApi;

export type GetViolationItemApiResponse = /** status 200 User Found */ Violation;
export type GetViolationItemApiArg = string;

export type UpdateViolationItemApiResponse = /** status 200 Violation Updated */ Violation;
export type UpdateViolationItemApiArg = Violation;

export type DeleteViolationItemApiResponse = unknown;
export type DeleteViolationItemApiArg = string;

export type GetViolationListApiResponse = /** status 200 OK */ Violation[];
export type GetViolationListApiArg = void;

export type CreateViolationItemApiResponse = /** status 201 Created */ Violation;
export type CreateViolationItemApiArg = {
  violation: Violation;
};

export type Violation = {
  property_id: string;
  violation_type: string;
  description: string;
  status: string;
};

// Utility function for derived/composed fields
export const getViolationDisplayData = (violationData: Violation) => ({
  fullName: `${ violationData.first_name} ${ violationData.last_name}`,
  fullAddress: `${ violationData.address_line_1}, ${ violationData.address_line_2 ? violationData.address_line_2 + ", " : ""}${ violationData.city}, ${ violationData.state}, ${ violationData.country} - ${ violationData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedViolation = {
  group: string;
  children?: Violation[];
};

export type AccumulatorType = Record<string, GroupedViolation>;

export const {
  useGetViolationItemQuery,
  useUpdateViolationItemMutation,
  useDeleteViolationItemMutation,
  useGetViolationListQuery,
  useCreateViolationItemMutation,
  useGetViolationCountriesQuery,
} = ViolationApi;

export type ViolationApiType = {
  [ViolationApi.reducerPath]: ReturnType<typeof ViolationApi.reducer>;
};

/**
 * Select filtered violation
 */
export const selectFilteredViolationList = (violation: Violation[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!violation) {
      return [];
    }

    if (searchText.length === 0) {
      return violation;
    }

    return FuseUtils.filterArrayByString<Violation>(violation, searchText);
  });

/**
 * Select grouped violation
 */
export const selectGroupedFilteredViolation = (violation: Violation[]) =>
  createSelector([selectFilteredViolationList(violation)], (filteredViolation) => {
    if (!filteredViolation) {
      return [];
    }

    const sortedViolation = [...filteredViolation]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedViolation> = sortedViolation?.reduce<AccumulatorType>((r, e) => {
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