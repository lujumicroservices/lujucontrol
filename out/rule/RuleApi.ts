import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './ruleAppSlice';

export const addTagTypes = [
  'rule_item',
  'rule',
  'rule_tag',
  'rule_tags',
  'countries',
] as const;

const RuleApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getRuleList: build.query<GetRuleListApiResponse, GetRuleListApiArg>({
        query: () => ({ url: `/api/mock/rule/items` }),
        providesTags: ['rule'],
      }),
      createRuleItem: build.mutation<CreateRuleItemApiResponse, CreateRuleItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/rule/items`,
          method: 'POST',
          body: queryArg.rule,
        }),
        invalidatesTags: ['rule'],
      }),
      getRuleItem: build.query<GetRuleItemApiResponse, GetRuleItemApiArg>({
        query: (ruleId) => ({
          url: `/api/mock/rule/items/${ ruleId}`,
        }),
        providesTags: ['rule_item'],
      }),
      updateRuleItem: build.mutation<UpdateRuleItemApiResponse, UpdateRuleItemApiArg>({
        query: (rule) => ({
          url: `/api/mock/rule/items/${ rule.id}`,
          method: 'PUT',
          body: rule,
        }),
        invalidatesTags: ['rule_item', 'rule'],
      }),
      deleteRuleItem: build.mutation<DeleteRuleItemApiResponse, DeleteRuleItemApiArg>({
        query: (ruleId) => ({
          url: `/api/mock/rule/items/${ ruleId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['rule'],
      }),
      getRuleCountries: build.query<GetRuleCountriesApiResponse, GetRuleCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default RuleApi;

export type GetRuleItemApiResponse = /** status 200 User Found */ Rule;
export type GetRuleItemApiArg = string;

export type UpdateRuleItemApiResponse = /** status 200 Rule Updated */ Rule;
export type UpdateRuleItemApiArg = Rule;

export type DeleteRuleItemApiResponse = unknown;
export type DeleteRuleItemApiArg = string;

export type GetRuleListApiResponse = /** status 200 OK */ Rule[];
export type GetRuleListApiArg = void;

export type CreateRuleItemApiResponse = /** status 201 Created */ Rule;
export type CreateRuleItemApiArg = {
  rule: Rule;
};

export type Rule = {
  title: string;
  description: string;
  category: string;
};

// Utility function for derived/composed fields
export const getRuleDisplayData = (ruleData: Rule) => ({
  fullName: `${ ruleData.first_name} ${ ruleData.last_name}`,
  fullAddress: `${ ruleData.address_line_1}, ${ ruleData.address_line_2 ? ruleData.address_line_2 + ", " : ""}${ ruleData.city}, ${ ruleData.state}, ${ ruleData.country} - ${ ruleData.postal_code}`,
});

export type Country = {
  id?: string;
  title?: string;
  iso?: string;
  code?: string;
  flagImagePos?: string;
};

export type GroupedRule = {
  group: string;
  children?: Rule[];
};

export type AccumulatorType = Record<string, GroupedRule>;

export const {
  useGetRuleItemQuery,
  useUpdateRuleItemMutation,
  useDeleteRuleItemMutation,
  useGetRuleListQuery,
  useCreateRuleItemMutation,
  useGetRuleCountriesQuery,
} = RuleApi;

export type RuleApiType = {
  [RuleApi.reducerPath]: ReturnType<typeof RuleApi.reducer>;
};

/**
 * Select filtered rule
 */
export const selectFilteredRuleList = (rule: Rule[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!rule) {
      return [];
    }

    if (searchText.length === 0) {
      return rule;
    }

    return FuseUtils.filterArrayByString<Rule>(rule, searchText);
  });

/**
 * Select grouped rule
 */
export const selectGroupedFilteredRule = (rule: Rule[]) =>
  createSelector([selectFilteredRuleList(rule)], (filteredRule) => {
    if (!filteredRule) {
      return [];
    }

    const sortedRule = [...filteredRule]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedRule> = sortedRule?.reduce<AccumulatorType>((r, e) => {
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