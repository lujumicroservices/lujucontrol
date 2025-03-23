import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './maintenanceAppSlice';

export const addTagTypes = [
  'maintenance_item',
  'maintenance',
  'maintenance_tag',
  'maintenance_tags',
  'countries',
] as const;

const MaintenanceApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getMaintenanceList: build.query<GetMaintenanceListApiResponse, GetMaintenanceListApiArg>({
        query: () => ({ url: `/api/mock/maintenance/items` }),
        providesTags: ['maintenance'],
      }),
      createMaintenanceItem: build.mutation<CreateMaintenanceItemApiResponse, CreateMaintenanceItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/maintenance/items`,
          method: 'POST',
          body: queryArg.maintenance,
        }),
        invalidatesTags: ['maintenance'],
      }),
      getMaintenanceItem: build.query<GetMaintenanceItemApiResponse, GetMaintenanceItemApiArg>({
        query: (maintenanceId) => ({
          url: `/api/mock/maintenance/items/${ maintenanceId}`,
        }),
        providesTags: ['maintenance_item'],
      }),
      updateMaintenanceItem: build.mutation<UpdateMaintenanceItemApiResponse, UpdateMaintenanceItemApiArg>({
        query: (maintenance) => ({
          url: `/api/mock/maintenance/items/${ maintenance.id}`,
          method: 'PUT',
          body: maintenance,
        }),
        invalidatesTags: ['maintenance_item', 'maintenance'],
      }),
      deleteMaintenanceItem: build.mutation<DeleteMaintenanceItemApiResponse, DeleteMaintenanceItemApiArg>({
        query: (maintenanceId) => ({
          url: `/api/mock/maintenance/items/${ maintenanceId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['maintenance'],
      }),
      getMaintenanceCountries: build.query<GetMaintenanceCountriesApiResponse, GetMaintenanceCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default MaintenanceApi;

export type GetMaintenanceItemApiResponse = /** status 200 User Found */ Maintenance;
export type GetMaintenanceItemApiArg = string;

export type UpdateMaintenanceItemApiResponse = /** status 200 Maintenance Updated */ Maintenance;
export type UpdateMaintenanceItemApiArg = Maintenance;

export type DeleteMaintenanceItemApiResponse = unknown;
export type DeleteMaintenanceItemApiArg = string;

export type GetMaintenanceListApiResponse = /** status 200 OK */ Maintenance[];
export type GetMaintenanceListApiArg = void;

export type CreateMaintenanceItemApiResponse = /** status 201 Created */ Maintenance;
export type CreateMaintenanceItemApiArg = {
  maintenance: Maintenance;
};

export type Maintenance = {
	id: string | null;
  property_id: string;
  issue_type: string;
  description: string;
  status: string;
};


export type GroupedMaintenance = {
  group: string;
  children?: Maintenance[];
};

export type AccumulatorType = Record<string, GroupedMaintenance>;

export const {
  useGetMaintenanceItemQuery,
  useUpdateMaintenanceItemMutation,
  useDeleteMaintenanceItemMutation,
  useGetMaintenanceListQuery,
  useCreateMaintenanceItemMutation,
  useGetMaintenanceCountriesQuery,
} = MaintenanceApi;

export type MaintenanceApiType = {
  [MaintenanceApi.reducerPath]: ReturnType<typeof MaintenanceApi.reducer>;
};

/**
 * Select filtered maintenance
 */
export const selectFilteredMaintenanceList = (maintenance: Maintenance[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!maintenance) {
      return [];
    }

    if (searchText.length === 0) {
      return maintenance;
    }

    return FuseUtils.filterArrayByString<Maintenance>(maintenance, searchText);
  });

/**
 * Select grouped maintenance
 */
export const selectGroupedFilteredMaintenance = (maintenance: Maintenance[]) =>
  createSelector([selectFilteredMaintenanceList(maintenance)], (filteredMaintenance) => {
    if (!filteredMaintenance) {
      return [];
    }

    const sortedMaintenance = [...filteredMaintenance]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedMaintenance> = sortedMaintenance?.reduce<AccumulatorType>((r, e) => {
      // get first letter of name of current element
      const group = e.issue_type[0];

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