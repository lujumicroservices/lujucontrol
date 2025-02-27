import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './staffAppSlice';

export const addTagTypes = ['staff_item', 'staff', 'staff_tag', 'staff_tags', 'countries'] as const;

const StaffApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getStaffList: build.query<GetStaffListApiResponse, GetStaffListApiArg>({
				query: () => ({ url: `/api/mock/staff/items` }),
				providesTags: ['staff']
			}),
			createStaffItem: build.mutation<CreateStaffItemApiResponse, CreateStaffItemApiArg>({
				query: (queryArg) => ({
					url: `/api/mock/staff/items`,
					method: 'POST',
					body: queryArg.staff
				}),
				invalidatesTags: ['staff']
			}),
			getStaffItem: build.query<GetStaffItemApiResponse, GetStaffItemApiArg>({
				query: (staffId) => ({
					url: `/api/mock/staff/items/${staffId}`
				}),
				providesTags: ['staff_item']
			}),
			updateStaffItem: build.mutation<UpdateStaffItemApiResponse, UpdateStaffItemApiArg>({
				query: (staff) => ({
					url: `/api/mock/staff/items/${staff.id}`,
					method: 'PUT',
					body: staff
				}),
				invalidatesTags: ['staff_item', 'staff']
			}),
			deleteStaffItem: build.mutation<DeleteStaffItemApiResponse, DeleteStaffItemApiArg>({
				query: (staffId) => ({
					url: `/api/mock/staff/items/${staffId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['staff']
			}),
			getStaffCountries: build.query<GetStaffCountriesApiResponse, GetStaffCountriesApiArg>({
				query: () => ({ url: `/api/mock/countries` }),
				providesTags: ['countries']
			})
		}),
		overrideExisting: false
	});

export default StaffApi;

export type GetStaffItemApiResponse = /** status 200 User Found */ Staff;
export type GetStaffItemApiArg = string;

export type UpdateStaffItemApiResponse = /** status 200 Staff Updated */ Staff;
export type UpdateStaffItemApiArg = Staff;

export type DeleteStaffItemApiResponse = unknown;
export type DeleteStaffItemApiArg = string;

export type GetStaffListApiResponse = /** status 200 OK */ Staff[];
export type GetStaffListApiArg = void;

export type CreateStaffItemApiResponse = /** status 201 Created */ Staff;
export type CreateStaffItemApiArg = {
	staff: Staff;
};

export type Staff = {
	address_line_1: string;
	address_line_2: string | null;
	birthdate: string;
	city: string;
	country: string;
	created_at: string | null;
	email: string;
	first_name: string;
	id: string;
	last_name: string;
	phone: string | null;
	postal_code: string;
	role: string;
	schedule: Json | null;
	state: string;
	updated_at: string | null;
};

// Utility function for derived/composed fields
export const getStaffDisplayData = (staffData: Staff) => ({
	fullName: `${staffData.first_name} ${staffData.last_name}`,
	fullAddress: `${staffData.address_line_1}, ${staffData.address_line_2 ? staffData.address_line_2 + ', ' : ''}${staffData.city}, ${staffData.state}, ${staffData.country} - ${staffData.postal_code}`
});

export type Country = {
	id?: string;
	title?: string;
	iso?: string;
	code?: string;
	flagImagePos?: string;
};

export type GroupedStaff = {
	group: string;
	children?: Staff[];
};

export type AccumulatorType = Record<string, GroupedStaff>;

export const {
	useGetStaffItemQuery,
	useUpdateStaffItemMutation,
	useDeleteStaffItemMutation,
	useGetStaffListQuery,
	useCreateStaffItemMutation,
	useGetStaffCountriesQuery
} = StaffApi;

export type StaffApiType = {
	[StaffApi.reducerPath]: ReturnType<typeof StaffApi.reducer>;
};

/**
 * Select filtered staff
 */
export const selectFilteredStaffList = (staff: Staff[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!staff) {
			return [];
		}

		if (searchText.length === 0) {
			return staff;
		}

		return FuseUtils.filterArrayByString<Staff>(staff, searchText);
	});

/**
 * Select grouped staff
 */
export const selectGroupedFilteredStaff = (staff: Staff[]) =>
	createSelector([selectFilteredStaffList(staff)], (filteredStaff) => {
		if (!filteredStaff) {
			return [];
		}

		const sortedStaff = [...filteredStaff]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedStaff> = sortedStaff?.reduce<AccumulatorType>((r, e) => {
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
