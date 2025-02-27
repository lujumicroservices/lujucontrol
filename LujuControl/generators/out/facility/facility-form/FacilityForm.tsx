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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import {
	useCreateFacilityItemMutation,
	useDeleteFacilityItemMutation,
	useGetFacilityItemQuery,
	useUpdateFacilityItemMutation,
	Facility
} from '../FacilityApi';
import FacilityModel from '../models/FacilityModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = Facility;

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().min(1).max(100),
	type: z.string().min(1).max(50),
	capacity: z.number().min(0),
	rules: z.string().min(1).max(500),
});

type FacilityFormProps = {
	isNew?: boolean;
};

/**
 * The facility form.
 */
function FacilityForm(props: FacilityFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const routeParams = useParams<{ facilityId: string }>();
	const { facilityId } = routeParams;

	const { data: facility, isError } = useGetFacilityItemQuery(facilityId, {
		skip: !facilityId || facilityId === null
	});

	const [createFacility] = useCreateFacilityItemMutation();
	const [updateFacility] = useUpdateFacilityItemMutation();
	const [deleteFacility] = useDeleteFacilityItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(FacilityModel({}));
		} else {
			reset({ ...facility });
		}
		// eslint-disable-next-line
	}, [facility, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createFacility({ facility: form })
				.unwrap()
				.then((action) => {
					navigate(`/facility/${action.id}`);
				});
		} else {
			updateFacility({ id: facility.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemoveFacility() {
		if (!facility) {
			return;
		}

		deleteFacility(facility.id).then(() => {
			navigate('/facility');
		});
	}

	const name = watch('first_name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/facility');
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
					name="name"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Facility Name"
							placeholder="Enter facility name"
							id="name"
							error={!!errors.name }
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth							
							InputProps=
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:building</FuseSvgIcon>
								</InputAdornment>
							),
							
						/>
					)}
				/>
				<Controller
					control={control}
					name="type"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Facility Type"
							placeholder="Enter facility type (e.g., gym, pool)"
							id="type"
							error={!!errors.type }
							helperText={errors?.type?.message}
							variant="outlined"
							required
							fullWidth							
							InputProps=
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
								</InputAdornment>
							),
							
						/>
					)}
				/>
				<Controller
					control={control}
					name="capacity"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Capacity"
							placeholder="Enter facility capacity"
							id="capacity"
							error={!!errors.capacity }
							helperText={errors?.capacity?.message}
							variant="outlined"
							required
							fullWidth							
							InputProps=
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:users</FuseSvgIcon>
								</InputAdornment>
							),
							
						/>
					)}
				/>
				<Controller
					control={control}
					name="rules"
					render={({ field }) => (
						<TextField
							className="mt-8"
							{...field}
							label="Rules"
							placeholder="Enter facility rules"
							id="rules"
							error={!!errors.rules }
							helperText={errors?.rules?.message}
							variant="outlined"
							required
							fullWidth							
							InputProps=
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:document-text</FuseSvgIcon>
								</InputAdornment>
							),
							
						/>
					)}
				/>


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemoveFacility }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/facility/${ facilityId}`}
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
			</div>
		</>
	);
}

export default FacilityForm;