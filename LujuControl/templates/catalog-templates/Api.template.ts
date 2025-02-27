import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './{{moduleNameLower}}AppSlice';

export const addTagTypes = [
  '{{moduleNameLower}}_item',
  '{{moduleNameLower}}',
  '{{moduleNameLower}}_tag',
  '{{moduleNameLower}}_tags',
  'countries',
] as const;

const {{moduleName}}Api = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      get{{moduleName}}List: build.query<Get{{moduleName}}ListApiResponse, Get{{moduleName}}ListApiArg>({
        query: () => ({ url: `/api/mock/{{moduleNameLower}}/items` }),
        providesTags: ['{{moduleNameLower}}'],
      }),
      create{{moduleName}}Item: build.mutation<Create{{moduleName}}ItemApiResponse, Create{{moduleName}}ItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/{{moduleNameLower}}/items`,
          method: 'POST',
          body: queryArg.{{moduleNameLower}},
        }),
        invalidatesTags: ['{{moduleNameLower}}'],
      }),
      get{{moduleName}}Item: build.query<Get{{moduleName}}ItemApiResponse, Get{{moduleName}}ItemApiArg>({
        query: ({{moduleNameLower}}Id) => ({
          url: `/api/mock/{{moduleNameLower}}/items/${ {{moduleNameLower}}Id}`,
        }),
        providesTags: ['{{moduleNameLower}}_item'],
      }),
      update{{moduleName}}Item: build.mutation<Update{{moduleName}}ItemApiResponse, Update{{moduleName}}ItemApiArg>({
        query: ({{moduleNameLower}}) => ({
          url: `/api/mock/{{moduleNameLower}}/items/${ {{moduleNameLower}}.id}`,
          method: 'PUT',
          body: {{moduleNameLower}},
        }),
        invalidatesTags: ['{{moduleNameLower}}_item', '{{moduleNameLower}}'],
      }),
      delete{{moduleName}}Item: build.mutation<Delete{{moduleName}}ItemApiResponse, Delete{{moduleName}}ItemApiArg>({
        query: ({{moduleNameLower}}Id) => ({
          url: `/api/mock/{{moduleNameLower}}/items/${ {{moduleNameLower}}Id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['{{moduleNameLower}}'],
      }),
      get{{moduleName}}Countries: build.query<Get{{moduleName}}CountriesApiResponse, Get{{moduleName}}CountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default {{moduleName}}Api;

export type Get{{moduleName}}ItemApiResponse = /** status 200 User Found */ {{moduleName}};
export type Get{{moduleName}}ItemApiArg = string;

export type Update{{moduleName}}ItemApiResponse = /** status 200 {{moduleName}} Updated */ {{moduleName}};
export type Update{{moduleName}}ItemApiArg = {{moduleName}};

export type Delete{{moduleName}}ItemApiResponse = unknown;
export type Delete{{moduleName}}ItemApiArg = string;

export type Get{{moduleName}}ListApiResponse = /** status 200 OK */ {{moduleName}}[];
export type Get{{moduleName}}ListApiArg = void;

export type Create{{moduleName}}ItemApiResponse = /** status 201 Created */ {{moduleName}};
export type Create{{moduleName}}ItemApiArg = {
  {{moduleNameLower}}: {{moduleName}};
};

export type {{moduleName}} = {
  {{#fields}}
  {{name}}: {{type}};
  {{/fields}}
};

// Utility function for derived/composed fields
export const get{{moduleName}}DisplayData = ({{moduleNameLower}}Data: {{moduleName}}) => ({
  fullName: `${ {{moduleNameLower}}Data.first_name} ${ {{moduleNameLower}}Data.last_name}`,
  fullAddress: `${ {{moduleNameLower}}Data.address_line_1}, ${ {{moduleNameLower}}Data.address_line_2 ? {{moduleNameLower}}Data.address_line_2 + ", " : ""}${ {{moduleNameLower}}Data.city}, ${ {{moduleNameLower}}Data.state}, ${ {{moduleNameLower}}Data.country} - ${ {{moduleNameLower}}Data.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type Grouped{{moduleName}} = {
  group: string;
  children?: {{moduleName}}[];
};

export type AccumulatorType = Record<string, Grouped{{moduleName}}>;

export const {
  useGet{{moduleName}}ItemQuery,
  useUpdate{{moduleName}}ItemMutation,
  useDelete{{moduleName}}ItemMutation,
  useGet{{moduleName}}ListQuery,
  useCreate{{moduleName}}ItemMutation,
  useGet{{moduleName}}CountriesQuery,
} = {{moduleName}}Api;

export type {{moduleName}}ApiType = {
  [{{moduleName}}Api.reducerPath]: ReturnType<typeof {{moduleName}}Api.reducer>;
};

/**
 * Select filtered {{moduleNameLower}}
 */
export const selectFiltered{{moduleName}}List = ({{moduleNameLower}}: {{moduleName}}[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!{{moduleNameLower}}) {
      return [];
    }

    if (searchText.length === 0) {
      return {{moduleNameLower}};
    }

    return FuseUtils.filterArrayByString<{{moduleName}}>({{moduleNameLower}}, searchText);
  });

/**
 * Select grouped {{moduleNameLower}}
 */
export const selectGroupedFiltered{{moduleName}} = ({{moduleNameLower}}: {{moduleName}}[]) =>
  createSelector([selectFiltered{{moduleName}}List({{moduleNameLower}})], (filtered{{moduleName}}) => {
    if (!filtered{{moduleName}}) {
      return [];
    }

    const sorted{{moduleName}} = [...filtered{{moduleName}}]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, Grouped{{moduleName}}> = sorted{{moduleName}}?.reduce<AccumulatorType>((r, e) => {
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