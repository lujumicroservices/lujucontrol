import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './propertyAppSlice';

export const addTagTypes = [
  'property_item',
  'property',
  'property_tag',
  'property_tags',
  'countries',
] as const;

const PropertyApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getPropertyList: build.query<GetPropertyListApiResponse, GetPropertyListApiArg>({
        query: () => ({ url: `/api/mock/property/items` }),
        providesTags: ['property'],
      }),
      createPropertyItem: build.mutation<CreatePropertyItemApiResponse, CreatePropertyItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/property/items`,
          method: 'POST',
          body: queryArg.property,
        }),
        invalidatesTags: ['property'],
      }),
      getPropertyItem: build.query<GetPropertyItemApiResponse, GetPropertyItemApiArg>({
        query: (propertyId) => ({
          url: `/api/mock/property/items/${ propertyId}`,
        }),
        providesTags: ['property_item'],
      }),
      updatePropertyItem: build.mutation<UpdatePropertyItemApiResponse, UpdatePropertyItemApiArg>({
        query: (property) => ({
          url: `/api/mock/property/items/${ property.id}`,
          method: 'PUT',
          body: property,
        }),
        invalidatesTags: ['property_item', 'property'],
      }),
      deletePropertyItem: build.mutation<DeletePropertyItemApiResponse, DeletePropertyItemApiArg>({
        query: (propertyId) => ({
          url: `/api/mock/property/items/${ propertyId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['property'],
      }),
      getPropertyCountries: build.query<GetPropertyCountriesApiResponse, GetPropertyCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default PropertyApi;

export type GetPropertyItemApiResponse = /** status 200 User Found */ Property;
export type GetPropertyItemApiArg = string;

export type UpdatePropertyItemApiResponse = /** status 200 Property Updated */ Property;
export type UpdatePropertyItemApiArg = Property;

export type DeletePropertyItemApiResponse = unknown;
export type DeletePropertyItemApiArg = string;

export type GetPropertyListApiResponse = /** status 200 OK */ Property[];
export type GetPropertyListApiArg = void;

export type CreatePropertyItemApiResponse = /** status 201 Created */ Property;
export type CreatePropertyItemApiArg = {
  property: Property;
};

export type Property = {
  address: string;
  unit_number: string;
  size: number;
  type: string;
  owner_id: string;
};

// Utility function for derived/composed fields
export const getPropertyDisplayData = (propertyData: Property) => ({
  fullName: `${ propertyData.first_name} ${ propertyData.last_name}`,
  fullAddress: `${ propertyData.address_line_1}, ${ propertyData.address_line_2 ? propertyData.address_line_2 + ", " : ""}${ propertyData.city}, ${ propertyData.state}, ${ propertyData.country} - ${ propertyData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedProperty = {
  group: string;
  children?: Property[];
};

export type AccumulatorType = Record<string, GroupedProperty>;

export const {
  useGetPropertyItemQuery,
  useUpdatePropertyItemMutation,
  useDeletePropertyItemMutation,
  useGetPropertyListQuery,
  useCreatePropertyItemMutation,
  useGetPropertyCountriesQuery,
} = PropertyApi;

export type PropertyApiType = {
  [PropertyApi.reducerPath]: ReturnType<typeof PropertyApi.reducer>;
};

/**
 * Select filtered property
 */
export const selectFilteredPropertyList = (property: Property[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!property) {
      return [];
    }

    if (searchText.length === 0) {
      return property;
    }

    return FuseUtils.filterArrayByString<Property>(property, searchText);
  });

/**
 * Select grouped property
 */
export const selectGroupedFilteredProperty = (property: Property[]) =>
  createSelector([selectFilteredPropertyList(property)], (filteredProperty) => {
    if (!filteredProperty) {
      return [];
    }

    const sortedProperty = [...filteredProperty]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedProperty> = sortedProperty?.reduce<AccumulatorType>((r, e) => {
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