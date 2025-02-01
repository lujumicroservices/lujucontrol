'use client';

import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import MembersEmailSelector from './email-selector/MembersEmailSelector';
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';
import {
	useCreateMembersItemMutation,
	useDeleteMembersItemMutation,
	useGetMembersItemQuery,
	useUpdateMembersItemMutation,
	Members
} from '../MembersApi';
import MembersModel from '../models/MembersModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}



type FormType = Members;

/**
 * Form Validation Schema
 */
const schema = z.object({
	first_name: z.string().min(1).max(100), // Varchar(100), not nullable
	last_name: z.string().min(1).max(100), // Varchar(100), not nullable
	email: z.string().email().max(150), // Varchar(150), not nullable
	phone: z.string().max(20).nullable().optional(), // Varchar(20), nullable
	address_line_1: z.string().min(1).max(255), // Varchar(255), not nullable
	address_line_2: z.string().max(255).nullable().optional(), // Varchar(255), nullable
	city: z.string().min(1).max(100), // Varchar(100), not nullable
	state: z.string().min(1).max(100), // Varchar(100), not nullable
	postal_code: z.string().min(1).max(20), // Varchar(20), not nullable
	country: z.string().min(1).max(100), // Varchar(100), not nullable
	birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'), // Date, not nullable
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'), // Date, not nullable
	end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'), // Date, not nullable

});

type MembersFormProps = {
	isNew?: boolean;
};

/**
 * The member form.
 */
function MembersForm(props: MembersFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const routeParams = useParams<{ memberId: string }>();
	const { memberId } = routeParams;

	const { data: member, isError } = useGetMembersItemQuery(memberId, {
		skip: !memberId || memberId === 'new'
	});

	const [createMembers] = useCreateMembersItemMutation();
	const [updateMembers] = useUpdateMembersItemMutation();
	const [deleteMembers] = useDeleteMembersItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(MembersModel({}));
		} else {
			reset({ ...member });
		}
		// eslint-disable-next-line
	}, [member, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createMembers({ member: form })
				.unwrap()
				.then((action) => {
					navigate(`/members/${action.id}`);
				});
		} else {
			updateMembers({ id: member.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemoveMembers() {
		if (!member) {
			return;
		}

		deleteMembers(member.id).then(() => {
			navigate('/members');
		});
	}

	const name = watch('first_name') + ' ' + watch('last_name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/members');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<Box
				className="relative w-full h-40 sm:h-48 px-8 sm:px-12"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				<img
					className="absolute inset-0 object-cover w-full h-full"
					src="/assets/images/cards/default-bk.jpg"
					alt="user background"
				/>
			</Box>

			<div className="relative flex flex-col flex-auto items-center px-6 sm:px-12">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-16">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-32 h-32 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black/50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-2 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-16 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
				</div>
				<Controller
					control={control}
					name="first_name"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="First name"
							placeholder="First name"
							id="first_name"
							error={!!errors.first_name}
							helperText={errors?.first_name?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="last_name"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Last name"
							placeholder="Last name"
							id="last_name"
							error={!!errors.last_name}
							helperText={errors?.last_name?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										
									</InputAdornment>
								)
							}}
						/>
					)}
				/>		

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Email"
							placeholder="Enter your email"
							id="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:envelope</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="phone"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Phone"
							placeholder="Enter your phone number"
							id="phone"
							error={!!errors.phone}
							helperText={errors?.phone?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="address_line_1"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Address Line 1"
							placeholder="Enter your address"
							id="address_line_1"
							error={!!errors.address_line_1}
							helperText={errors?.address_line_1?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="address_line_2"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Address Line 2"
							placeholder="Enter additional address details"
							id="address_line_2"
							error={!!errors.address_line_2}
							helperText={errors?.address_line_2?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="city"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="City"
							placeholder="Enter your city"
							id="city"
							error={!!errors.city}
							helperText={errors?.city?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="state"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="State"
							placeholder="Enter your state"
							id="state"
							error={!!errors.state}
							helperText={errors?.state?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="postal_code"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Postal Code"
							placeholder="Enter your postal code"
							id="postal_code"
							error={!!errors.postal_code}
							helperText={errors?.postal_code?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="country"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Country"
							placeholder="Enter your country"
							id="country"
							error={!!errors.country}
							helperText={errors?.country?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="birthdate"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());  // Ensures ISO string format
							}}
							className="mt-8 mb-4 w-full"
							slotProps={{
								textField: {
									id: 'birthdate',
									label: 'Birthdate',
									InputLabelProps: {
										shrink: true,
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.birthdate,
									helperText: errors?.birthdate?.message,
								},
								actionBar: {
									actions: ['clear', 'today'],
								},
							}}
							slots={{
								openPickerIcon: BirthdayIcon,
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="start_date"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());  // Ensures ISO string format
							}}
							className="mt-8 mb-4 w-full"
							slotProps={{
								textField: {
									id: 'start_date',
									label: 'Start Date',
									InputLabelProps: {
										shrink: true,
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.start_date,
									helperText: errors?.start_date?.message,
								},
								actionBar: {
									actions: ['clear', 'today'],
								},
							}}
							slots={{
								openPickerIcon: CalendarIcon,
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="end_date"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());  // Ensures ISO string format
							}}
							className="mt-8 mb-4 w-full"
							slotProps={{
								textField: {
									id: 'end_date',
									label: 'End Date',
									InputLabelProps: {
										shrink: true,
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.end_date,
									helperText: errors?.end_date?.message,
								},
								actionBar: {
									actions: ['clear', 'today'],
								},
							}}
							slots={{
								openPickerIcon: CalendarIcon,
							}}
						/>
					)}
				/>





			</div>
			<Box
				className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
				sx={{ backgroundColor: 'background.default' }}
			>
				{!isNew && (
					<Button
						color="error"
						onClick={handleRemoveMembers}
					>
						Delete
					</Button>
				)}
				<Button
					component={Link}
					className="ml-auto"
					to={`/members/${memberId}`}
				>
					Cancel
				</Button>
				<Button
					className="ml-2"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSubmit(onSubmit)}
				>
					Save
				</Button>
			</Box>
		</>
	);
}

export default MembersForm;
