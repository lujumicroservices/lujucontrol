import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './playerAppSlice';

export const addTagTypes = [
  'player_item',
  'player',
  'player_tag',
  'player_tags',
  'countries',
] as const;

const PlayerApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getPlayerList: build.query<GetPlayerListApiResponse, GetPlayerListApiArg>({
        query: () => ({ url: `/api/mock/player/items` }),
        providesTags: ['player'],
      }),
      createPlayerItem: build.mutation<CreatePlayerItemApiResponse, CreatePlayerItemApiArg>({
        query: (queryArg) => ({
          url: `/api/mock/player/items`,
          method: 'POST',
          body: queryArg.player,
        }),
        invalidatesTags: ['player'],
      }),
      getPlayerItem: build.query<GetPlayerItemApiResponse, GetPlayerItemApiArg>({
        query: (playerId) => ({
          url: `/api/mock/player/items/${ playerId}`,
        }),
        providesTags: ['player_item'],
      }),
      updatePlayerItem: build.mutation<UpdatePlayerItemApiResponse, UpdatePlayerItemApiArg>({
        query: (player) => ({
          url: `/api/mock/player/items/${ player.id}`,
          method: 'PUT',
          body: player,
        }),
        invalidatesTags: ['player_item', 'player'],
      }),
      deletePlayerItem: build.mutation<DeletePlayerItemApiResponse, DeletePlayerItemApiArg>({
        query: (playerId) => ({
          url: `/api/mock/player/items/${ playerId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['player'],
      }),
      getPlayerCountries: build.query<GetPlayerCountriesApiResponse, GetPlayerCountriesApiArg>({
        query: () => ({ url: `/api/mock/countries` }),
        providesTags: ['countries'],
      }),
    }),
    overrideExisting: false,
  });

export default PlayerApi;

export type GetPlayerItemApiResponse = /** status 200 User Found */ Player;
export type GetPlayerItemApiArg = string;

export type UpdatePlayerItemApiResponse = /** status 200 Player Updated */ Player;
export type UpdatePlayerItemApiArg = Player;

export type DeletePlayerItemApiResponse = unknown;
export type DeletePlayerItemApiArg = string;

export type GetPlayerListApiResponse = /** status 200 OK */ Player[];
export type GetPlayerListApiArg = void;

export type CreatePlayerItemApiResponse = /** status 201 Created */ Player;
export type CreatePlayerItemApiArg = {
  player: Player;
};

export type Player = {
	id: string;
  first_name: string;
  last_name: string;
  birth_date: date;
  jersey_number: number;
  position: select;
  team_name: string;
  medical_conditions: string;
  created_at: date;
  updated_at: date;
};


export type GroupedPlayer = {
  group: string;
  children?: Player[];
};

export type AccumulatorType = Record<string, GroupedPlayer>;

export const {
  useGetPlayerItemQuery,
  useUpdatePlayerItemMutation,
  useDeletePlayerItemMutation,
  useGetPlayerListQuery,
  useCreatePlayerItemMutation,
  useGetPlayerCountriesQuery,
} = PlayerApi;

export type PlayerApiType = {
  [PlayerApi.reducerPath]: ReturnType<typeof PlayerApi.reducer>;
};

/**
 * Select filtered player
 */
export const selectFilteredPlayerList = (player: Player[]) =>
  createSelector([selectSearchText], (searchText) => {
    if (!player) {
      return [];
    }

    if (searchText.length === 0) {
      return player;
    }

    return FuseUtils.filterArrayByString<Player>(player, searchText);
  });

/**
 * Select grouped player
 */
export const selectGroupedFilteredPlayer = (player: Player[]) =>
  createSelector([selectFilteredPlayerList(player)], (filteredPlayer) => {
    if (!filteredPlayer) {
      return [];
    }

    const sortedPlayer = [...filteredPlayer]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    const groupedObject: Record<string, GroupedPlayer> = sortedPlayer?.reduce<AccumulatorType>((r, e) => {
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