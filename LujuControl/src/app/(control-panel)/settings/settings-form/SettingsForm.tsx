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
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import {
	useCreateSettingsItemMutation,
	useDeleteSettingsItemMutation,
	useGetSettingsItemQuery,
	useUpdateSettingsItemMutation,
	Settings
} from '../SettingsApi';
import SettingsModel from '../models/SettingsModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = Settings;

/**
 * Form Validation Schema
 */
const schema = z.object({
	description: z.string().min(1).max(50),
	monthly_cost: z.number().min(0).max(10000),
	annual_cost: z.number().min(0).max(100000),
	default_payment_due_day: z.number().int().min(1).max(31),
	max_late_days: z.number().int().min(0).max(60),
	late_fee_percentage: z.number().min(0).max(100),
});

type SettingsFormProps = {
	isNew?: boolean;
};

/**
 * The settings form.
 */
function SettingsForm(props: SettingsFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const routeParams = useParams<{ settingsId: string }>();
	const { settingsId } = routeParams;

	const { data: settings, isError } = useGetSettingsItemQuery(settingsId, {
		skip: !settingsId || settingsId === 'new'
	});

	const [createSettings] = useCreateSettingsItemMutation();
	const [updateSettings] = useUpdateSettingsItemMutation();
	const [deleteSettings] = useDeleteSettingsItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(SettingsModel({}));
		} else {
			reset({ ...settings });
		}
		// eslint-disable-next-line
	}, [settings, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createSettings({ settings: form })
				.unwrap()
				.then((action) => {
					navigate(`/settings/${action.id}`);
				});
		} else {
			updateSettings({ id: settings.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemoveSettings() {
		if (!settings) {
			return;
		}

		deleteSettings(settings.id).then(() => {
			navigate('/settings');
		});
	}

	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/settings');
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
					src="/assets/images/cards/settings.jpeg"
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

				<div className="field-group">
				<Typography variant="h6" sx={{ 
						fontWeight: 'bold', mb: 2 
					}}
				>
					<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
					payments
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Description"
								placeholder="Enter a description"
								id="description"
								error={!!errors.description }
								helperText={errors?.description?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}></FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="monthly_cost"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Monthly Cost"
								placeholder="Enter the monthly fee"
								id="monthly_cost"
								error={!!errors.monthly_cost }
								helperText={errors?.monthly_cost?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="annual_cost"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Annual Cost"
								placeholder="Enter the annual fee"
								id="annual_cost"
								error={!!errors.annual_cost }
								helperText={errors?.annual_cost?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="default_payment_due_day"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Default Payment Due Day"
								placeholder="Enter the default due day"
								id="default_payment_due_day"
								error={!!errors.default_payment_due_day }
								helperText={errors?.default_payment_due_day?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:calendar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="max_late_days"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Max Late Payment Days"
								placeholder="Enter the max late days before penalty"
								id="max_late_days"
								error={!!errors.max_late_days }
								helperText={errors?.max_late_days?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:clock</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="late_fee_percentage"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Late Fee Percentage"
								placeholder="Enter the late fee percentage"
								id="late_fee_percentage"
								error={!!errors.late_fee_percentage }
								helperText={errors?.late_fee_percentage?.message}
								variant="outlined"
								
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:percent</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
			
								</div>
							</div>
				<div className="field-group">
				<Typography variant="h6" sx={{ 
						fontWeight: 'bold', mb: 2 
					}}
				>
					<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
					general
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

			
								</div>
							</div>


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemoveSettings }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/settings/${ settingsId}`}
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

export default SettingsForm;