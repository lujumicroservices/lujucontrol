import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './settingsAppSlice';

export const addTagTypes = [
  'settings_item',
  'settings',
  'settings_tag',
  'settings_tags',
  'countries',
] as const;

const SettingsApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSettingsList: build.query<GetSettingsListApiResponse, GetSettingsListApiArg>({
        query: () => ({ url: `/api/mock/settings/items` }),
        providesTags: ['settings'],
      }),
      createSettingsItem: build.mutation<CreateSettingsItemApiResponse, CreateSettingsItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/settings/items`,
          method: 'POST',
          body: queryArg.settings,
        }),
        invalidatesTags: ['settings'],
      }),
      getSettingsItem: build.query<GetSettingsItemApiResponse, GetSettingsItemApiArg>({
        query: (settingsId) => ({
          url: `/api/mock/settings/items/${ settingsId}`,
        }),
        providesTags: ['settings_item'],
      }),
      updateSettingsItem: build.mutation<UpdateSettingsItemApiResponse, UpdateSettingsItemApiArg>({
        query: (settings) => ({
          url: `/api/mock/settings/items/${ settings.id}`,
          method: 'PUT',
          body: settings,
        }),
        invalidatesTags: ['settings_item', 'settings'],
      }),
      deleteSettingsItem: build.mutation<DeleteSettingsItemApiResponse, DeleteSettingsItemApiArg>({
        query: (settingsId) => ({
          url: `/api/mock/settings/items/${ settingsId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['settings'],
      }),
      getSettingsCountries: build.query<GetSettingsCountriesApiResponse, GetSettingsCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default SettingsApi;

export type GetSettingsItemApiResponse = /** status 200 User Found */ Settings;
export type GetSettingsItemApiArg = string;

export type UpdateSettingsItemApiResponse = /** status 200 Settings Updated */ Settings;
export type UpdateSettingsItemApiArg = Settings;

export type DeleteSettingsItemApiResponse = unknown;
export type DeleteSettingsItemApiArg = string;

export type GetSettingsListApiResponse = /** status 200 OK */ Settings[];
export type GetSettingsListApiArg = void;

export type CreateSettingsItemApiResponse = /** status 201 Created */ Settings;
export type CreateSettingsItemApiArg = {
  settings: Settings;
};

export type Settings = {
	id: string;
  description: string;
  monthly_cost: number;
  annual_cost: number;
  default_payment_due_day: number;
  max_late_days: number;
  late_fee_percentage: number;
  created_at: date;
  updated_at: date;
};


export type GroupedSettings = {
  group: string;
  children?: Settings[];
};

export type AccumulatorType = Record<string, GroupedSettings>;

export const {
  useGetSettingsItemQuery,
  useUpdateSettingsItemMutation,
  useDeleteSettingsItemMutation,
  useGetSettingsListQuery,
  useCreateSettingsItemMutation,
  useGetSettingsCountriesQuery,
} = SettingsApi;

export type SettingsApiType = {
  [SettingsApi.reducerPath]: ReturnType<typeof SettingsApi.reducer>;
};

/**
 * Select filtered settings
 */
export const selectFilteredSettingsList = (settings: Settings[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!settings) {
      return [];
    }

    if (searchText.length === 0) {
      return settings;
    }

    return FuseUtils.filterArrayByString<Settings>(settings, searchText);
  });

/**
 * Select grouped settings
 */
export const selectGroupedFilteredSettings = (settings: Settings[]) =>
  createSelector([selectFilteredSettingsList(settings)], (filteredSettings) => {
    if (!filteredSettings) {
      return [];
    }

    const sortedSettings = [...filteredSettings]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedSettings> = sortedSettings?.reduce<AccumulatorType>((r, e) => {
      // get first letter of name of current element
      const group = e.description[0];

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