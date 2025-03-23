import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './feeAppSlice';

export const addTagTypes = [
  'fee_item',
  'fee',
  'fee_tag',
  'fee_tags',
  'countries',
] as const;

const FeeApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getFeeList: build.query<GetFeeListApiResponse, GetFeeListApiArg>({
        query: () => ({ url: `/api/mock/fee/items` }),
        providesTags: ['fee'],
      }),
      createFeeItem: build.mutation<CreateFeeItemApiResponse, CreateFeeItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/fee/items`,
          method: 'POST',
          body: queryArg.fee,
        }),
        invalidatesTags: ['fee'],
      }),
      getFeeItem: build.query<GetFeeItemApiResponse, GetFeeItemApiArg>({
        query: (feeId) => ({
          url: `/api/mock/fee/items/${ feeId}`,
        }),
        providesTags: ['fee_item'],
      }),
      updateFeeItem: build.mutation<UpdateFeeItemApiResponse, UpdateFeeItemApiArg>({
        query: (fee) => ({
          url: `/api/mock/fee/items/${ fee.id}`,
          method: 'PUT',
          body: fee,
        }),
        invalidatesTags: ['fee_item', 'fee'],
      }),
      deleteFeeItem: build.mutation<DeleteFeeItemApiResponse, DeleteFeeItemApiArg>({
        query: (feeId) => ({
          url: `/api/mock/fee/items/${ feeId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['fee'],
      }),
      getFeeCountries: build.query<GetFeeCountriesApiResponse, GetFeeCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default FeeApi;

export type GetFeeItemApiResponse = /** status 200 User Found */ Fee;
export type GetFeeItemApiArg = string;

export type UpdateFeeItemApiResponse = /** status 200 Fee Updated */ Fee;
export type UpdateFeeItemApiArg = Fee;

export type DeleteFeeItemApiResponse = unknown;
export type DeleteFeeItemApiArg = string;

export type GetFeeListApiResponse = /** status 200 OK */ Fee[];
export type GetFeeListApiArg = void;

export type CreateFeeItemApiResponse = /** status 201 Created */ Fee;
export type CreateFeeItemApiArg = {
  fee: Fee;
};

export type Fee = {
  property_id: string;
  amount: number;
  due_date: string;
  status: string;
};

// Utility function for derived/composed fields
export const getFeeDisplayData = (feeData: Fee) => ({
  fullName: `${ feeData.first_name} ${ feeData.last_name}`,
  fullAddress: `${ feeData.address_line_1}, ${ feeData.address_line_2 ? feeData.address_line_2 + ", " : ""}${ feeData.city}, ${ feeData.state}, ${ feeData.country} - ${ feeData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedFee = {
  group: string;
  children?: Fee[];
};

export type AccumulatorType = Record<string, GroupedFee>;

export const {
  useGetFeeItemQuery,
  useUpdateFeeItemMutation,
  useDeleteFeeItemMutation,
  useGetFeeListQuery,
  useCreateFeeItemMutation,
  useGetFeeCountriesQuery,
} = FeeApi;

export type FeeApiType = {
  [FeeApi.reducerPath]: ReturnType<typeof FeeApi.reducer>;
};

/**
 * Select filtered fee
 */
export const selectFilteredFeeList = (fee: Fee[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!fee) {
      return [];
    }

    if (searchText.length === 0) {
      return fee;
    }

    return FuseUtils.filterArrayByString<Fee>(fee, searchText);
  });

/**
 * Select grouped fee
 */
export const selectGroupedFilteredFee = (fee: Fee[]) =>
  createSelector([selectFilteredFeeList(fee)], (filteredFee) => {
    if (!filteredFee) {
      return [];
    }

    const sortedFee = [...filteredFee]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedFee> = sortedFee?.reduce<AccumulatorType>((r, e) => {
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